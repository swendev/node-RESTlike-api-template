module.exports = function(grunt) {

	// project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		// concurrent tasks
		concurrent:  {
			dev: {
				tasks: ["watch", "nodemon"],
				options: {
					logConcurrentOutput: true
				}
			},
			all: {
				tasks: ["shell", "watch", "nodemon"],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		// --------------------- server setup ---------------------
		// start mongod with a project specific path
		shell: {
			mongodb: {
				command: 'mongod --dbpath ./src/data/db',
				options: {
					async: true,
					stdout: true,
					stderr: true,
					failOnError: true,
					execOptions: {
						cwd: '.'
					}
				}
			}
		},
		// start and watch node server app
		nodemon: {
			dev: {
				script: "./src/server.js",
				options: {
					watch: ["src/"]
				}
			}
		},

		// --------------------- client setup ---------------------
		// client watcher
		watch: {
			dev:  {
				files: ["src/**/*.js"],
				tasks: ["jshint"]
			}
		},
		clean: {
			dist: {
				src: ["dist/"]
			}
		},
		copy: {
			dist: {
				files: [
					{expand: true, cwd: "src/", src: ["server.js", "package.json", "app/**/*", "data/db"], dest: "dist/"}
				]
			}
		},
		// lint all javascript files
		jshint: {
			dev: ["src/**/*.js"]
		}

	});

	// load plugins
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-nodemon");

	// define tasks
	grunt.registerTask("all", ["concurrent:all"]);
	grunt.registerTask("1 - db", ["shell"]);
	grunt.registerTask("2 - server", ["concurrent:dev"]);
	grunt.registerTask("build", ["jshint:dev", "clean:dist", "copy"]);
};