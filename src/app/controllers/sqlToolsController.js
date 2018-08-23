(function (angular) {
    "use strict";
    var app = angular.module('app');

    app.controller('SqlToolsController', SqlToolsController)
    
    SqlToolsController.$inject = ["$scope"];
    function SqlToolsController($scope) {
        var sq = this;
        sq.csvFile = {};       

        var settings = JSON.parse(localStorage.getItem('settings')); 
        if(settings){
            sq.treatNullsAsStrings = settings.treatNullsAsStrings;
            sq.treatSQLMethodsAsStrings = settings.treatSQLMethodsAsStrings;
            sq.treatNumbersAsStrings = settings.treatNumbersAsStrings;
            sq.fileHasHeaders = settings.fileHasHeaders;
            sq.ignoreDuplicates = settings.ignoreDuplicates;
            sq.ignoreWhiteLines = settings.ignoreWhiteLines;
        }

        sq.convertCommaSepList = function (text) {            
            updateSettings();
            if (text) {
                var stringOutput = [];
                _.each(text.split("\n"), function (n) {
                    stringOutput.push("'" + n.trim().replace("'", "''") + "'")
                });

                if(sq.ignoreDuplicates){
                    stringOutput = _.uniq(stringOutput);
                }

                var result = _.trimEnd(stringOutput.join(), ",")
                
                if(sq.ignoreWhiteLines){
                    result = result.replace(/'',/g, "");
                }
                
                sq.commaListOutput = result;
            }
            return sq.commaListOutput;
        }
        
        sq.convertCSVFile = function(fileText){
            updateSettings();

            var papaConfig = {
                dynamicTyping : true,
                header : sq.fileHasHeaders
            }            
            
            var res = Papa.parse(fileText, papaConfig).data;
            var resStr = "";
            _.each(res, function(rowContent){
                rowContent = _.map(rowContent, function(cell){
                    switch(typeof cell){
                        case "string":
                            cell = cell.trim()
                            if(sq.treatNullsAsStrings && cell === "NULL"){
                                return convertToSqlString(cell);
                            }
                            else if(!sq.treatNullsAsStrings && cell === "NULL"){
                                return cell;                              
                            }                        
                            else if(sq.treatSQLMethodsAsStrings && cell !== "" && cell !== "NULL"){
                                cell = convertToSqlString(cell);
                            }
                            else if(!sq.treatSQLMethodsAsStrings && cell !== "" && cell !== "NULL"){
                                if(!isSQLMethod(cell)){
                                    cell = convertToSqlString(cell);
                                }
                                else {
                                    cell = cell.trim().replace("'", "''");
                                }
                            }
                            break;
                        case "number":
                            if((sq.treatNumbersAsStrings) && cell !== ""){
                                cell = "'" + cell + "'"; 
                            }
                            break;
                    }

                    return cell || "NULL"; 
                });

                var row = "";
                row += "(";
                row += rowContent.join(",");
                row += "),\r\n";
                                
                var allNulls = _.every(rowContent, function(e){
                    return e === "NULL";
                });

                //Prevent any rows entirely consisting of nulls from being entered.
                if(!allNulls){
                    resStr += row;
                }
            });
            
            resStr = resStr.slice(0, -3);
            sq.csvFileOutput = resStr;
            return sq.csvFileOutput;
        }

        $scope.$watch('sq.csvFile', function(newVal, oldVal){
            if(newVal && newVal !== oldVal && !_.isEmpty(newVal)){
                sq.csvText = newVal;
                sq.convertCSVFile(newVal);
            }
        });

        function updateSettings(){
            var newSettings = {
                treatNullsAsStrings : sq.treatNullsAsStrings,
                treatSQLMethodsAsStrings : sq.treatSQLMethodsAsStrings,
                treatNumbersAsStrings : sq.treatNumbersAsStrings,
                fileHasHeaders : sq.fileHasHeaders,
                ignoreDuplicates : sq.ignoreDuplicates,
                ignoreWhiteLines : sq.ignoreWhiteLines
            }

            localStorage.setItem('settings', JSON.stringify(newSettings));
        }
    }
})(window.angular);

function isSQLMethod(str){
    if(str[str.length-2] === '(' && str[str.length-1] === ')'){
        return true;
    }
    return false;
}

function convertToSqlString(str){
    return "'" + str.trim().replace("'", "''") + "'";
}