import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsRoot = path.join(projectRoot, 'assets');
const readErrors = new Map();
const requiredFiles = [
  'index.html',
  'assets/app.js',
  'assets/styles.css',
  'assets/fonts',
  'assets/gifs/opening.gif',
  'assets/gifs/mr42aipu-midnightgif300.gif',
  'assets/gifs/mochi-peachcat-cute-cat.gif',
  'README.md',
  'PRD.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'package.json',
  'package-lock.json',
  'tailwind.config.js',
  'src/styles.css',
  'scripts/build.mjs',
  'scripts/check.mjs'
];

const gifByteBudgets = [
  { relativePath: 'assets/gifs/opening.gif', maxBytes: 7_000_000 },
  { relativePath: 'assets/gifs/mr42aipu-midnightgif300.gif', maxBytes: 2_000_000 },
  { relativePath: 'assets/gifs/mochi-peachcat-cute-cat.gif', maxBytes: 512_000 }
];

const releaseSourceFiles = [
  'index.html',
  'assets/app.js',
  'assets/styles.css',
  'assets/fonts/LICENSE.txt',
  'src/styles.css',
  'tailwind.config.js',
  'README.md',
  'PRD.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md'
];

const joinFragments = (fragments) => fragments.join('');
const legacyRecipient = joinFragments(['Stas', 'ya']);
const legacyRecipientSurname = joinFragments(['An', 'nesty']);
const legacyCreatorShort = joinFragments(['Ad', 'it']);
const legacyCreatorFirst = joinFragments(['Ad', 'it', 'ya']);
const legacyCreatorMiddle = joinFragments(['Ard', 'iansyah']);
const legacyCreatorSurname = joinFragments(['Ram', 'adhan']);
const legacyPatternGroups = [
  [legacyRecipient, legacyRecipientSurname],
  [legacyRecipient],
  [legacyRecipientSurname],
  [legacyCreatorShort],
  [legacyCreatorFirst],
  [legacyCreatorMiddle],
  [legacyCreatorSurname],
  [legacyCreatorShort, legacyCreatorMiddle, legacyCreatorSurname],
  [legacyCreatorFirst, legacyCreatorMiddle, legacyCreatorSurname]
];

const runtimeDependencyRules = [
  { pattern: /cdn\.tailwindcss\.com/i, label: 'Tailwind browser CDN' },
  { pattern: /fonts\.googleapis\.com\/css/i, label: 'Google Fonts CSS' },
  { pattern: /fonts\.gstatic\.com/i, label: 'Google Fonts asset host' },
  { pattern: /tailwind\.config\s*=/i, label: 'inline Tailwind config' },
  {
    pattern:
      /<(?:script|link)\b[^>]*\s(?:src|href)\s*=\s*(?:"(?:https?:)?\/\/[^" ]*"|'(?:https?:)?\/\/[^' ]*'|(?:https?:)?\/\/[^\s>]+)/i,
    label: 'external application script/style URL'
  }
];

const readProjectFile = (relativePath) => {
  const absolutePath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return '';
  }

  try {
    return fs.readFileSync(absolutePath, 'utf8');
  } catch (error) {
    readErrors.set(
      relativePath,
      error instanceof Error ? error.message : String(error)
    );
    return '';
  }
};

const isNonEmptyFile = (relativePath) => {
  const absolutePath = path.join(projectRoot, relativePath);

  try {
    const stats = fs.statSync(absolutePath);
    return stats.isFile() && stats.size > 0;
  } catch {
    return false;
  }
};

const findLegacyIdentityFiles = () => {
  const legacyPatterns = legacyPatternGroups.map((parts) =>
    new RegExp(`\\b${parts.join(' ').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  );

  return releaseSourceFiles.filter((relativePath) => {
    const source = readProjectFile(relativePath);
    return legacyPatterns.some((pattern) => pattern.test(source));
  });
};

const getAssetReferenceIssue = (reference) => {
  const normalizedReference = path.normalize(reference);
  const absolutePath = path.resolve(projectRoot, normalizedReference);
  const relativeToAssets = path.relative(assetsRoot, absolutePath);

  if (
    relativeToAssets === '' ||
    relativeToAssets === '..' ||
    relativeToAssets.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToAssets)
  ) {
    return 'outside assets root';
  }

  try {
    if (fs.lstatSync(assetsRoot).isSymbolicLink()) {
      return 'assets root is a symlink';
    }

    let currentPath = assetsRoot;
    for (const segment of relativeToAssets.split(path.sep)) {
      currentPath = path.join(currentPath, segment);
      if (fs.lstatSync(currentPath).isSymbolicLink()) {
        return 'path contains a symlink';
      }
    }

    return fs.statSync(absolutePath).isFile() ? '' : 'not a file';
  } catch {
    return 'missing or unreadable';
  }
};

const findInvalidAssetReferences = (html) => {
  const attributeReferences = [
    ...html.matchAll(
      /(?:^|\s)(?:src|href)\s*=\s*(?:"(assets\/[^"\s]*)"|'(assets\/[^'\s]*)'|(assets\/[^\s"'=<>]*))/gi
    )
  ]
    .map(([, doubleQuoted, singleQuoted, unquoted]) =>
      doubleQuoted ?? singleQuoted ?? unquoted
    )
    .map((reference) => reference.split(/[?#]/, 1)[0]);

  const srcsetReferences = [...html.matchAll(
    /(?:^|\s)srcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi
  )]
    .flatMap(([, doubleQuoted, singleQuoted]) => (doubleQuoted ?? singleQuoted)
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
      .filter((reference) => reference.startsWith('assets/'))
    );

  const references = [...attributeReferences, ...srcsetReferences];

  return [...new Set(references)]
    .map((reference) => ({ reference, issue: getAssetReferenceIssue(reference) }))
    .filter(({ issue }) => issue);
};

const failures = [];
const missingFiles = requiredFiles.filter(
  (relativePath) => !fs.existsSync(path.join(projectRoot, relativePath))
);

if (missingFiles.length > 0) {
  failures.push(`Missing required paths:\n${missingFiles.join('\n')}`);
}

const oversizedGifs = gifByteBudgets.flatMap(({ relativePath, maxBytes }) => {
  const absolutePath = path.join(projectRoot, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  try {
    const size = fs.statSync(absolutePath).size;
    return size > maxBytes
      ? [`${relativePath}: ${size} bytes (max ${maxBytes})`]
      : [];
  } catch (error) {
    return [`${relativePath}: unable to inspect file (${error instanceof Error ? error.message : String(error)})`];
  }
});

if (oversizedGifs.length > 0) {
  failures.push(`GIF byte budget exceeded:\n${oversizedGifs.join('\n')}`);
}

const html = readProjectFile('index.html');
const runtimeDependencyViolations = runtimeDependencyRules
  .filter(({ pattern }) => pattern.test(html))
  .map(({ label }) => label);

if (runtimeDependencyViolations.length > 0) {
  failures.push(`Prohibited runtime dependencies: ${runtimeDependencyViolations.join(', ')}`);
}

const legacyIdentityFiles = findLegacyIdentityFiles();

if (legacyIdentityFiles.length > 0) {
  failures.push(`Legacy identity found in: ${legacyIdentityFiles.join(', ')}`);
}

if (readErrors.size > 0) {
  failures.push(
    `Unable to read release source files:\n${[...readErrors.entries()]
      .map(([relativePath, error]) => `${relativePath}: ${error}`)
      .join('\n')}`
  );
}

const invalidAssetReferences = findInvalidAssetReferences(html);

if (invalidAssetReferences.length > 0) {
  failures.push(
    `Invalid local asset references:\n${invalidAssetReferences
      .map(({ reference, issue }) => `${reference}: ${issue}`)
      .join('\n')}`
  );
}

if (!isNonEmptyFile('assets/styles.css')) {
  failures.push('Generated stylesheet is missing or empty: assets/styles.css');
}

if (failures.length > 0) {
  process.stderr.write(`Release check failed.\n${failures.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    [
      'Release check passed.',
      `- Required paths: ${requiredFiles.length}`,
      '- Runtime dependencies: local only',
      '- Legacy identity scan: clean',
      '- Local HTML asset references: resolved',
      '- Generated stylesheet: present',
      '- GIF byte budgets: enforced'
    ].join('\n') + '\n'
  );
}
