(function( $ ){

    var methods = {
       init : function( options ) {
  
          return this.each(function() {  
            //สุ่มตัวเลข
              var settings = {
                  levels : [ 
                      {level: "Easy", numbers: 60},
                      {level: "Medium", numbers: 30},
                      {level: "Hard", numbers: 20}
                  ]
              };
  
              var defaults = {
                  matrix : [],  domMatrix : [],  numOfRows : 9,  numOfCols : 9,  level : 40,  
                  selected : null,  selectedSolution : null,  
                  anwerTracker : {
                      "1" : 9, "2" : 9, "3" : 9, "4" : 9, "5" : 9, "6" : 9, "7" : 9, "8" : 9,"9" : 9
                  }
              }
                if ( options ) {
                    $.extend( settings, options );
                }
  
              var $this = $(this);
              $this.addClass('sdk-game');
              
              //สร้างตารางตัวเลข Sudoku
              $this.createMatrix = function() {
                  var matrix = new Array();
                  for(var rowCounter=0;rowCounter<9;rowCounter++){
                      matrix[rowCounter] = new Array();
                      for(var colCounter=0;colCounter<9;colCounter++){
                          var number = colCounter/1 + 1 + (rowCounter*3) + Math.floor(rowCounter/3)%3;
                          if(number>9) number = number % 9;
                          if(number==0) number=9;
                          matrix[rowCounter][colCounter] = number;				
                      }			
                  }
                  //สลับแถวภายในตารางที่สร้างไว้
                  for(var no=0;no<9;no+=3){
                      for(var no2=0;no2<3;no2++){
                          row1 = Math.floor(Math.random()*3);	
                          row2 = Math.floor(Math.random()*3);	
                          while(row2==row1){
                              row2 = Math.floor(Math.random()*3);	
                          }
                          row1 = row1 + no;
                          row2 = row2 + no;			
                          var tmpMatrix = new Array();
                          tmpMatrix = matrix[row1];
                          matrix[row1] = matrix[row2];
                          matrix[row2] = tmpMatrix; 				
                      }			
                  }
                  //สลับคอลัมน์ภายในตารางที่สร้างไว้
                  for(var no=0;no<9;no+=3){
                      for(var no2=0;no2<3;no2++){
                          col1 = Math.floor(Math.random()*3);	
                          col2 = Math.floor(Math.random()*3);	
                          while(col2==col1){
                              col2 = Math.floor(Math.random()*3);	
                          }
                          col1 = col1 + no;
                          col2 = col2 + no;			
                          var tmpMatrix = new Array();
                          for(var no3=0;no3<matrix.length;no3++){
                              tmpMatrixValue = matrix[no3][col1];
                              matrix[no3][col1] = matrix[no3][col2];				
                              matrix[no3][col2] = tmpMatrixValue;				
                          }
                      }	
                  }
                  return matrix;
              };
              
              //สร้างตารางที่เล่น
              $this.createTable = function() {
                  //array ที่เก็บ DOM ไปยังตาราง Matrix
                  defaults.domMatrix = [];
                  //สร้างตาราง
                  defaults.table = $("<div class='sdk-table sdk-no-show'></div>");
                  //เพิ่มแถวและคอลัมน์ลงตาราง
                  for (var row=0;row<defaults.numOfRows;row++) {
                      defaults.domMatrix[row] = [];
                      var tempRow = $("<div class='sdk-row'></div>");
                      //กำหนดเส้นทึบหลังแถวที่ 3 กับ 6
                      if (row == 2 || row == 5) tempRow.addClass("sdk-border"); 
                      for (var col=0;col<defaults.numOfCols;col++) {
                          defaults.domMatrix[row][col] = $("<div class='sdk-col' data-row='"+row+"' data-col='"+col+"'></div>");
                          //กำหนดเส้นทึบหลังคอลัมน์ที่ 3 กับ 6
                          if (col == 2 || col == 5) defaults.domMatrix[row][col].addClass("sdk-border");
                          //เพิ่มคอลัมน์ลงในแถว
                          tempRow.append(defaults.domMatrix[row][col]);
                      }
                      //เพิ่มแถวลงตาราง
                      defaults.table.append(tempRow);
                  }
                  //เพิ่ม div เพื่อตกแต่งพื้นหลัง
                  defaults.table.append("<div class='sdk-table-bk'></div>");
                  //เพิ่มตารางลงหน้าจอ
                  $this.append(defaults.table);
                  
                  //สร้างตารางตัวเลขสุ่มความยาก
                  var items = defaults.level;
                  while (items > 0) {
                      var row = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
                      var col = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
                      if (defaults.domMatrix[row][col].children().length == 0) {
                          defaults.domMatrix[row][col].append("<div class='sdk-solution'>"+ defaults.matrix[row][col] +"</div>");
                          defaults.anwerTracker[defaults.matrix[row][col].toString()]--;
                          items--;
                      }
                  }
                  //เมื่อคลิกที่ตาราง
                  defaults.table.find(".sdk-col").click(function () {
                      //ลบตัวช่วย
                      $this.find(".sdk-solution").removeClass("sdk-helper");
                      $this.find(".sdk-col").removeClass("sdk-selected");
                      if ($(this).children().length == 0) {
                          defaults.domMatrix[$(this).attr("data-row")][$(this).attr("data-col")].addClass("sdk-selected");
                          defaults.selected = defaults.domMatrix[$(this).attr("data-row")][$(this).attr("data-col")];
                          defaults.selectedSolution = defaults.matrix[$(this).attr("data-row")][$(this).attr("data-col")]
                      } else {
                          //เพิ่ม highlight
                          $this.highlightHelp(parseInt($(this).text()));
                      }
                  });
                  
                  //เพิ่มตัวเลขลงตารางบนหน้าจอ
                  $this.answerPicker();
                                  
                  //ลบ Class sdk-no-show หลังเวลาผ่านไปตามค่าของเวลาที่กำหนด หน่วยเวลา คือ มิลลิวินาที
                  setTimeout(function () {
                      defaults.table.removeClass("sdk-no-show");
                  }, 500);
              };
              
              //เพิ่มตัวเลขบนหน้าจอ
              $this.answerPicker = function() {
                  //ทำกล่องตัวเลข 
                  var answerContainer = $("<div class='sdk-ans-container'></div>");
                  //เพิ่มปุ่มตัวเลข
                  for (var a in defaults.anwerTracker) {
                      //ตรวจสอบการแสดงของปุ่ม
                      if (defaults.anwerTracker[a] > 0) {
                          answerContainer.append("<div class='sdk-btn'>"+a+"</div>");
                      } else {
                          answerContainer.append("<div class='sdk-btn sdk-no-show'>"+a+"</div>");
                      }
                  }
                  answerContainer.find(".sdk-btn").click(function () {
                      //ทำในกรณีที่มีแสดงเท่านั้น
                      if (!$(this).hasClass("sdk-no-show") && defaults.selected != null && defaults.selected.children().length == 0 ) {
                          //เช็คตัวเลขที่เลือก
                          if ( defaults.selectedSolution == parseInt($(this).text()) ) {
                              //ลบจำนวนตัวเลขที่ track
                              defaults.anwerTracker[$(this).text()]--;
                              //ถ้าตัวเลขที่ track เป็น 0 ให้ลบตัวเลขที่เลือกออก
                              if (defaults.anwerTracker[$(this).text()] == 0) {
                                  $(this).addClass("sdk-no-show");
                              }
                              //ลบ highlight
                              $this.find(".sdk-col").removeClass("sdk-selected");
                              //เพิ่มคำตอบลงบนจอ
                              defaults.selected.append("<div class='sdk-solution'>"+ defaults.selectedSolution +"</div>");
                          }
                          
                      }
                  });
                  $this.append(answerContainer);
                  
              };
              
              //เพิ่ม highlight
              $this.highlightHelp = function(number) {
                  //loop ผ่าน Matri DOM เพื่อหาตัวเลขที่เราคลิกในตาราง
                  for (var row=0;row<defaults.numOfRows;row++) {
                      for (var col=0;col<defaults.numOfCols;col++) {
                          if ( parseInt(defaults.domMatrix[row][col].text()) == number ) {
                              defaults.domMatrix[row][col].find(".sdk-solution").addClass("sdk-helper");
                          }
                      }
                  }
              };
              
              //สร้างตัวเลือกความยาก
              $this.createDiffPicker = function() {
                  //ตัวแปรตัวเลือกเลเวล
                  var picker = $("<div class='sdk-picker sdk-no-show'></div>");
                  //คำสั่งนี้จะวนลูปผ่าน array ที่เก็บข้อมูลเกี่ยวกับ level ความยากง่ายต่างๆ และสร้างปุ่มสำหรับแต่ละ level
                  $(settings.levels).each(function (e) {
                      picker.append("<div class='sdk-btn' data-level='"+this.numbers+"'>"+this.level+"</div>");
                  });
                  //เพิ่มลงบนหน้าจอ
                  $this.append(picker);
                  //คลิกเลือกเลเวล
                  picker.find(".sdk-btn").click(function () {
                      picker.addClass("sdk-no-show"); /*เพิ่ม Class sdk-no-show*/
                      defaults.level = parseInt($(this).attr("data-level"));
                      //wait for animation to complete to continue on
                      setTimeout(function () {
                          // remove the picker from the DOM
                          picker.remove();
                          //เพิ่มตารางลงบนจอ 
                          $this.createTable();
                      }, 2000);
                  });
                  //ลบ Class sdk-no-show หลังเวลาผ่านไปตามค่าของเวลาที่กำหนด หน่วยเวลา คือ มิลลิวินาที
                  setTimeout(function () {
                      picker.removeClass("sdk-no-show");
                  }, 500);
              };
              
              defaults.matrix = $this.createMatrix();
              $this.createDiffPicker();
              
                    
           });
       }
    };   	 	
    //เรียกใช้งาน
    $.fn.sudoku = function( method ) {
      
      if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.sudoku' );
      }    
    
    };
  
  })( jQuery );