const gulp = require('gulp');
const execa = require('gulp-execa');
const hashsum = require('gulp-hashsum');
const del = require('del');

var path7za;
try {
	path7za = require('7zip-bin').path7za;
} catch (e) {
	path7za = '7za';
}

const buildDir = '../build',
	artifactDir = `artifacts`;

const sep = '===============';

const platforms = process.env.npm_package_config_buildPlatform.split(','),
	archs = process.env.npm_package_config_buildArch.split(','),
	buildTasks = {},
	zipTasks = {};

exports.clean = function () {
	return del(`${buildDir}/**/*`, { force: true });
};

function buildFor(platform) {
	console.log(`${sep}
Building for: ${platform}
${sep}`);

	let cmd = `electron-packager . ${process.env.npm_package_name}
--platform=${platform}
--arch=${process.env.npm_package_config_buildArch}
--electron-version=${process.env.npm_package_config_electronVersion}
--no-tmpdir
--out=${buildDir}/
--app-version=${process.env.npm_package_version}
--icon=res/favicon.${platform === 'darwin' ? 'icns' : 'ico'}
--win32metadata.FileDescription="${process.env.npm_package_config_productName}"
--win32metadata.ProductName="${process.env.npm_package_config_productName}"
--overwrite`.replace(/\n/g, ' ');

	return execa.exec(cmd);
}

for (const platform of platforms) {
	buildTasks[platform] = () => buildFor(platform);
}

async function buildLog(cb) {
	console.log(`${sep}
Package name: ${process.env.npm_package_name}
Electron version: ${process.env.npm_package_config_electronVersion}
App version: ${process.env.npm_package_version}
Product name: ${process.env.npm_package_config_productName}
${sep}`);
	cb();
}

exports.build = gulp.series(
	buildLog,
	platforms.map(p => buildTasks[p])
);

async function zipFor(platform, arch) {
	let basename = `${process.env.npm_package_name}-${platform}-${arch}`,
		baseDir = `${buildDir}/${basename}`,
		zipType = platform === 'win32' ? 'zip' : 'tar';

	console.log(`${sep}
Zip name: ${platform}-${arch}
Zip type: ${zipType}
Build name: ${basename}
Build path: ${baseDir}
${sep}`);

	let cmd =	zipType === 'tar' ?
		`${path7za} a -ttar -so -snl "../artifacts/${basename}.tar" . | ${path7za} a -si "../artifacts/${basename}.tgz"` :
		`${path7za} a -tzip "../artifacts/${basename}.zip" .`;

	if (process.platform === 'win32') {
		cmd += ' | find /I "ing"';
	}

	await del(`${buildDir}/${artifactDir}/${basename}.{tar,tgz,zip}`, { force: true });
	return await execa.exec(cmd, { cwd: baseDir, shell: true });
}

for (const platform of platforms) {
	for (const arch of archs) {
		zipTasks[platform] = () => zipFor(platform, arch);
	}
}

exports.zip = gulp.series(
	platforms.map(p => zipTasks[p])
);

exports.hash = function () {
	return gulp.src(`${buildDir}/${artifactDir}/*.{tgz,zip}`)
		.pipe(hashsum({
			dest: `${buildDir}/${artifactDir}/`,
			hash: 'sha1',
			filename: 'SHA1SUMS.txt',
		}));
};
