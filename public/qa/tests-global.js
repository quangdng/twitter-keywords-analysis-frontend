/**
 * Created by Quang Nguyen on 1/05/2015.
 */

suite('Global Tests', function(){
    test('page has a valid title', function(){
        assert(document.title && document.title.match(/\S/) &&
            document.title.toUpperCase() !== 'TODO');
    });
});