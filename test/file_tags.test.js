//
// nodeunit tests for tags task
//

var grunt = require('grunt');

module.exports = {
    setUp: function (done) {
        done();
    },
    file_tags: function (test) {
        var expected = grunt.file.read('test/expect/file-tags.html');
        var actual = grunt.file.read('test/tmp/file-tags.html');
        test.equal(expected, actual, 'should process a basic tags task');

        test.done();
    }
};
