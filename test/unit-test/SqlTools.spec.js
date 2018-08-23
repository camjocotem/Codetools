describe('SQLToolsController',function(){
    beforeEach(angular.mock.module('app'));
    var $controller;
    var scope;
    var sq;
    beforeEach(inject(function(_$controller_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        scope = _$rootScope_.$new(); //If using scope, a new scope needs to be created from the rootScope
        sq = $controller('SqlToolsController', {$scope: scope});
    }));
    
    describe('Comma separated list', function(){
        it('should quote and separate new lines by comma.', function(){
            expect(sq.convertCommaSepList("ASDF\nFDSA")).toEqual("'ASDF','FDSA'");
        });
        it('should ignore blank lines when "ignoreWhiteLines" is true"', function(){
            sq.ignoreWhiteLines = true;
            expect(sq.convertCommaSepList("ASDF\n\nFDSA")).toEqual("'ASDF','FDSA'");
        });
        it('should not ignore blank lines when "ignoreWhiteLines" is false"', function(){
            sq.ignoreWhiteLines = false;
            expect(sq.convertCommaSepList("ASDF\n\nFDSA")).toEqual("'ASDF','','FDSA'");
        });
        it('should trim trailing whitespace',function(){
            expect(sq.convertCommaSepList("ASDF \nFDSA")).toEqual("'ASDF','FDSA'");
        });
        it('should double any existing quotes', function(){
            expect(sq.convertCommaSepList("ASDF'\nFDSA")).toEqual("'ASDF''','FDSA'");
        });
        it('should ignore any duplicate items when "ignoreDuplicates" is true', function(){
            sq.ignoreDuplicates = true;
            expect(sq.convertCommaSepList("ASDF\nFDSA\nASDF")).toEqual("'ASDF','FDSA'");
        });
        it('should keep duplicates when "ignoreDuplicates" is false', function(){
            sq.ignoreDuplicates = false;
            expect(sq.convertCommaSepList("ASDF\nFDSA\nASDF")).toEqual("'ASDF','FDSA','ASDF'");
        })
    });
    
    describe('Converting csv file', function(){
        it('should put quotes around strings', function(){
            expect(sq.convertCSVFile('ASDF')).toEqual("('ASDF')");
        });
        
        it('should add NULL when a comma is used without adding a string', function(){
            expect(sq.convertCSVFile('ASDF,')).toEqual("('ASDF',NULL)");
        });
        
        it('should leave numbers as numbers', function(){
            expect(sq.convertCSVFile('234')).toEqual("(234)");
        });
        
        it('should put quotes around numbers when "treatNumbersAsStrings" is true', function(){
            sq.treatNumbersAsStrings = true;
            expect(sq.convertCSVFile('234')).toEqual("('234')");            
        });
        it('should ignore any rows that are entirely null', function(){
            var csvInput = 'a,b,c,d\n'+
                        'awera,a,awer,aw\n'+
                        'awera,w,awera,er\n'+
                        '';
            expect(sq.convertCSVFile(csvInput).slice(-6)).not.toEqual("(NULL)");
        });
        it('should trim trailing whitespace', function(){
            expect(sq.convertCSVFile("ASDF ,ASDF2")).toEqual("('ASDF','ASDF2')");
        });
        it('should double up on any existing quotes', function(){
            expect(sq.convertCSVFile("ASDF'")).toEqual("('ASDF''')");
        });
        it('should add quotes on SQL methods when "treatSQLMethodsAsStrings" is true', function(){
            sq.treatSQLMethodsAsStrings = true;
            expect(sq.convertCSVFile('asdf, NEWID()')).toEqual("('asdf','NEWID()')")
        });
        it('should not have quotes on SQL methods when "treatSQLMethodsAsStrings" is false', function(){
            sq.treatSQLMethodsAsStrings = false;
            expect(sq.convertCSVFile('asdf, NEWID()')).toEqual("('asdf',NEWID())")
        });
        it('should have quotes on NULL when "treatNullsAsStrings" is true', function(){
            sq.treatNullsAsStrings = true;
            expect(sq.convertCSVFile('asdf, NULL')).toEqual("('asdf','NULL')")
        });
        it('should not have quotes on NULL when "treatNullsAsStrings" is false', function(){
            sq.treatNullsAsStrings = false;
            expect(sq.convertCSVFile('asdf, NULL')).toEqual("('asdf',NULL)")
        });
    })
});