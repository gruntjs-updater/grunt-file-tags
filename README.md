# grunt-file-tags

> Dynamically includes source tags for script/link/whatever files on disk.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-file-tags --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-tags');
```

## The "file_tags" task

### Overview
In your project's Gruntfile, add a section named `file_tags` to the data object passed into `grunt.initConfig()`.

	grunt.initConfig({
		file_tags: {
            scripts: {
                options: {
                    tagTemplate: '<script src="{{ path }}"></script>',
                    openTag: '<!-- start script tags -->',
                    closeTag: '<!-- end script tags -->'
                },
                src: [
                    'source/**/*.js'
                ],
                dest: 'build/file-tags.html'
            }
        }
	});

### Options

#### options.tagTemplate

Type: `String`

Default value: `<script src="{{ path }}"></script>`

Example value (stylesheet): `<link rel="stylesheet" href="{{ path }}"/>`

A matched file will compile the `options.tagTemplate` template with the file path.

#### options.openTag
Type: `String`

Default value: `<!-- start file tags -->`

Specify where in the destination file to start adding script/link/whatever tags.

#### options.closeTag
Type: `String`

Default value: `<!-- end file tags -->`

Specify where in the destination file to stop script/link/whatever tags.

### Usage Examples

#### Default Options

The following is the default configuration. `tags` will generate script tags for all matching `src` files and using the default `tagTemplate` defined above. It will then add these tags to `site/index.html` between the default `<!-- start file tags -->` and `<!-- end file tags -->`.

	grunt.initConfig({
		file_tags: {
		    build: {
		        src: [
		            'site/js/**/*.js',
		            '!site/js/vendor/**/*.js'
		        ],
		        dest: 'site/index.html'
		    }
		}
	});
	grunt.registerTask('default', ['file_tags:build']);

#### Custom Options

You can override all default options. In the following multi-task, we have four tasks, one for compiling scripts `scripts`, one for compiling link tags, `styles`, one for compiling image tags, `images`, one for compiling LESS imports, `less`.

All tasks override the default `tagTemplate`, letting your define you own template with extra attributes. It also overrides `openTag` and `closeTag`, specifying that they are for the associated files.

	grunt.initConfig({
		file_tags: {
            scripts: {
                options: {
                    tagTemplate: '<script src="{{ path }}" type="text/javascript"></script>',
                    openTag: '<!-- start custom script tags -->',
                    closeTag: '<!-- end custom script tags -->'
                },
                src: [
                    'source/**/*.js'
                ],
                dest: 'build/index.html'
            },
            styles: {
                options: {
                    tagTemplate: '<link rel="stylesheet" href="{{ path }}" type="text/css"/>',
                    openTag: '<!-- start custom style tags -->',
                    closeTag: '<!-- end custom style tags -->'
                },
                src: [
                    'source/**/*.css'
                ],
                dest: 'build/index.html'
            },
            images: {
                options: {
                    tagTemplate: '<img src="{{ path }}"/>',
                    openTag: '<!-- start custom image tags -->',
                    closeTag: '<!-- end custom image tags -->'
                },
                src: [
                    'source/img/folder/*.jpg'
                ],
                dest: 'build/index.html'
            },
            less: {
                options: {
                    tagTemplate: '@import "{{ path }}";',
                    openTag: '/* start style tags */',
                    closeTag: '/* end style tags */'
                },
                src: [
                    'js/**/*.less'
                ],
                dest: 'build/style/app.less'
            },
        }
	});
	grunt.registerTask('default', ['file_tags:scripts', 'file_tags:styles']);

This plugin will scan through the `src` files, and insert all matching files into the `dest` file between the `openTag` and `closeTag`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Credits
This project is basically a refactor of the excellent work done by Andrew Mead (@andrewjmead on npm) with his grunt-script-link-tags plugin.

## Release History
2015-04-03  v0.1.4  Updated README, performed code cleanup.
2015-04-02  v0.1.3  Warn instead of fail on missing start/close tags
2015-04-02  v0.1.2  Updated README
2015-03-13  v0.1.1  Initial release
