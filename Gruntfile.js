'use strict';

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		appConfig : {
			src : 'src',
			dist : 'dist',
			tmp : '.tmp',
			test : 'test'
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish')
			},
			all : {
				src : [ '<%= appConfig.src %>/**/*.js' ]
			},
			test : {
				options : {
					jshintrc : '<%= appConfig.test %>/.jshintrc'
				},
				src : [ '<%= appConfig.test %>/spec/**/*.js' ]
			}
		},

		// Empties folders to start fresh
		clean : {
			dist : {
				files : [ {
					dot : true,
					src : [ '<%= appConfig.tmp %>', '<%= appConfig.dist %>/{,*/}*', '!<%= appConfig.dist %>/.git*' ]
				} ]
			}
		},

		concat : {
			dist : {
				src : [ '<%= appConfig.src %>/app.js', '<%= appConfig.src %>/services/*.js', '<%= appConfig.src %>/resources/*.js' ],
				dest : '<%= appConfig.dist %>/ngBonita.js'
			}
		},

		// ng-annotate tries to make the code safe for minification
		// automatically by using the Angular long form for dependency
		// injection.
		ngAnnotate : {
			dist : {
				files : [ {
					expand : true,
					cwd : '<%= appConfig.dist %>',
					src : [ 'ngBonita.js' ],
					dest : '<%= appConfig.tmp %>'
				} ]
			}
		},

		uglify : {
			dist : {
				files : {
					'<%= appConfig.dist %>/ngBonita-min.js' : [ '<%= appConfig.tmp %>/ngBonita.js' ]
				}
			}
		},

		update_json : {
			bower : {
				src : 'package.json',
				dest : 'bower.json',
				fields : [ 'name', 'version', 'description', 'repository', 'keywords', 'licences' ]
			}
		}
	});

	grunt.registerTask('test', function () {
		console.log('***** TODO *****');
	});

	grunt.registerTask('build', [ 'clean:dist', 'concat', 'ngAnnotate', 'uglify', 'update_json' ]);

	grunt.registerTask('default', [ 'newer:jshint', 'test', 'build' ]);
};
