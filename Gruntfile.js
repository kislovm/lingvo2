var vendor = 'jquery backbone backbone.marionette'.split(' ');

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['build'],
            dev: {
                src: ['build/app.js', 'build/<%= pkg.name %>.css', 'build/<%= pkg.name %>.js']
            },
            prod: ['dist']
        },

        browserify: {
            vendor: {
                files: {
                    'build/vendor.js': []
                },
                options: {
                    require: vendor
                }
            },
            app: {
                files: {
                    'build/app.js': ['client/src/main.js']
                },
                options: {
                    transform: ['hbsfy'],
                    external: vendor
                }
            }
        },

        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        copy: {
            dev: {
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    src: 'client/images/*',
                    dest: 'public/images/'
                }, {
                    src: 'client/styles/style.css',
                    dest: 'public/css/myapp.css'
                },
                {
                	src: 'client/styles/media-queries.css',
                    dest: 'public/css/media-queries.css'
                }]
            },
            prod: {
                files: [{
                    src: ['client/images/*'],
                    dest: 'dist/images/'
                }]
            }
        },

        // CSS minification.
        /*cssmin: {
            minify: {
                src: ['build/<%= pkg.name %>.css'],
                dest: 'public/css/<%= pkg.name %>.css'

                

            }
        },*/

        // Javascript minification.
        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'dist/js/<%= pkg.name %>.js'
                }]
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/templates/*.hbs', 'client/src/**/*.js', 'client/styles/*.css'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']

            },
            options: {
                interval: 100,
                livereload: true
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    watchedFolders: ['controllers', 'app'],
                    env: {
                        PORT: '3300'
                    }
                }
            }
        },


        // mongod server launcher
        shell: {
            mongo: {
                command: 'mongod',
                options: {
                    async: true
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'shell:mongo', 'watch:scripts'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'client/src/**/*.js'],
            dev: ['client/src/**/*.js']
        },
        livereload: {

        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('init:dev', ['clean', 'browserify:vendor']);

    grunt.registerTask('build:dev', ['clean:dev', 'browserify:vendor', 'browserify:app', 'jshint:dev', 'concat', 'copy:dev']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:app', 'jshint:all', 'concat', 'uglify', 'copy:prod']);

    grunt.registerTask('heroku', ['init:dev', 'build:dev']);

    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
};
