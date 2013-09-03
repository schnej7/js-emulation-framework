var exampleTests = {
    name : "Example Tests",
    tests : [
    {
      name: "Log 10",
      time: 0.01,
      test: function(){ for( var i = 0; i < 10; i++ ){console.log('hi');} }
    },
    {
      name: "Log 100",
      time: 0.01,
      test: function(){ for( var i = 0; i < 100; i++ ){console.log('hi');} }
    },
    {
      name: "Log 1000",
      time: 0.02,
      test: function(){ for( var i = 0; i < 1000; i++ ){console.log('hi');} }
    }]
};
