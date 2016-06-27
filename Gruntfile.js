var vendor = 'jquery backbone backbone.marionette'.split(' ');

module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        i18next: {
            dev: {
                src: ['client/**/*.{js,hbs}', 'controllers/*.js'],
                dest: 'locale',
                options: {
                    lngs: ['en', 'ru-RU', 'dev'],
                    resource: {
                        loadPath: 'i18n/{{lng}}/{{ns}}.json',
                        savePath: 'locale/i18n/{{lng}}/{{ns}}.json'
                    }
                }
            }
        },

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
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js'],
            'build/<%= pkg.name %>.css': ['client/styles/*.css']
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
                    src: 'build/<%= pkg.name %>.css',
                    dest: 'public/css/<%= pkg.name %>.css'
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
                tasks: ['clean:dev', 'browserify:vendor', 'browserify:app', 'concat', 'copy:dev']

            },
            options: {
                interval: 10,
                spawn: false
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('i18next-scanner');

    grunt.registerTask('init:dev', ['clean', 'browserify:vendor']);

    grunt.registerTask('build:dev', ['clean:dev', 'browserify:vendor', 'browserify:app', 'concat', 'copy:dev']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:app', 'jshint:all', 'concat', 'uglify', 'copy:prod']);

    grunt.registerTask('heroku', ['init:dev', 'build:dev']);

    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
};
