var timingTestEngine = function(){
    var that = this;
    this.currentSet = null;
    this._tests = [];
    this.numTests = 0;
    this.loadTestSet = function( testSet ){
        for( var i = 0; i < testSet.tests.length; i++ ){
            testSet.tests[i].index = this.numTests++;
            testSet.tests[i].testSet = testSet.name;
        }
        this._tests = this._tests.concat( testSet.tests );
    },
    this.createTimeElement = function( time ){
        var testRow = window.document.createElement('tr');
        testRow.class = 'time';
        testRow.innerHTML = '<h3>Total time:' + (time/1000) + '</h3>';
        return testRow;
    },
    this.createTestSetTitle = function( testSet ){
        var testRow = window.document.createElement('tr');
        testRow.class = 'title';
        testRow.innerHTML = '<h1>' + testSet + '</h1>';
        return testRow;
    },
    this.createTestElement = function( time, test ){
        var timeClass = (test.time) ? (test.time < (time / 1000) ? "badtime" : "goodtime") : "notime";
        var index = test.index;
        var testRow = window.document.createElement('tr');
        var nameDiv = window.document.createElement('td');
        var timeDiv = window.document.createElement('td');
        var numDiv = window.document.createElement('td');
        var showDiv = window.document.createElement('td');
        testRow.className = 'test';
        showDiv.className = 'show';
        testRow.id = 'test-' + index;
        testRow.onclick = function( event ){
            var testTable = window.document.getElementById('testTable');
            var node = event.srcElement || event.target;
            while( node.tagName != "TR" ){
                node = node.parentNode;
            }
            var testIndex = node.id.replace( 'test-', '' );
            that.report = function( time, test ){
                var afterRow = node.nextSibling;
                testTable.removeChild( node );
                var testRow = that.createTestElement( time, test );
                testTable.insertBefore( testRow, afterRow );
            }
            that.runTest( that._tests[ testIndex ] );
        }
        showDiv.onclick = function( event ){
            event.stopPropagation();
            var node = event.srcElement || event.target;
            while( node.tagName != "TR" ){
                node = node.parentNode;
            }
            var testIndex = node.id.replace( 'test-', '' );
            var tWindow = window.open('', '');
            tWindow.document.write('<pre>' + that._tests[testIndex].test + '</pre>');
        }
        nameDiv.className = 'name';
        numDiv.className = 'num';
        nameDiv.innerHTML = test.name;
        timeDiv.className = timeClass;
        timeDiv.innerHTML = time/1000;
        showDiv.innerHTML = "code";
        numDiv.innerHTML = index;
        testRow.appendChild( numDiv );
        testRow.appendChild( timeDiv );
        testRow.appendChild( showDiv );
        testRow.appendChild( nameDiv );
        return testRow;
    };
    this.runTests = function(){
        this.start = new Date().getTime();
        this.testQueue = this._tests.slice(0);

        // Create the reporting table
        var body = window.document.getElementsByTagName('body')[0];
        var testTable = window.document.getElementById('testTable');
        if( testTable !== null ){
            body.removeChild(testTable);
        }
        testTable = window.document.createElement('table');
        testTable.id = 'testTable';
        body.appendChild(testTable);

        // Callback to report each test
        this.report = function( time, test ){
            var testRow = this.createTestElement( time, test );
            if( this.currentSet != test.testSet ){
                this.currentSet = test.testSet;
                testTable.appendChild( this.createTestSetTitle( test.testSet ) );
            }
            testTable.appendChild( testRow );
            var nextTest = this.testQueue.shift(); 
            if( nextTest ){
                setTimeout( this.runTest, 10, nextTest);
            }
            else{
                this.end = new Date().getTime();
                testTable.appendChild( this.createTimeElement( this.end - this.start ) );
            }
        }
        this.runTest(this.testQueue.shift());
    };
    this.runTest = function( test ){
        if( test == null ){ return; }
        var tWindow = window.open('', '');
        window.testComplete = function( time ){
            that.report( time, test );
        }
        test.before = test.before || function(){};
        test.after = test.after || function(){};
        test.test = test.test || function(){};
        test.src = test.src || [];
        test.globals = test.globals || [];
        tWindow.document.write("<body>");
        for( var i = 0; i < test.src.length; i++ ){
            tWindow.document.write("<script src='"+test.src[i]+"'></script>");
        }
        for( var i = 0; i < test.globals.length; i++ ){
            tWindow.document.write("<script> var " + test.globals[i] + "; </script>");
        }
        tWindow.document.write("<script> var testBefore = " + test.before + ", testAfter = " + test.after + ", test = " + test.test + "; </script>");
        tWindow.document.write("<script>" +
            "testBefore();" +
            "var start = new Date().getTime();" +
            "test();" +
            "var end = new Date().getTime();" +
            "testAfter();" +
            "opener.testComplete( end - start );" +
            "window.close();" +
            "</script>"
        );
        tWindow.document.write("</body>");
    };
}
