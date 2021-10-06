

// noteItemDB is the websql database name
var db = openDatabase("noteItemDB","1.0","itemDB", 1024*1024*1024);
const body = document.querySelector('body');

// section variable
var edit;

// body main created
setTimeout(()=>{
  const welcome = document.querySelector('.welcome');
  welcome.remove();
  document.querySelector('.note_top').style.display = "initial";
  createHomePage();
}, 2500);

function createHomePage(){
  const notepad = document.createElement('div');
  notepad.setAttribute('class', 'notepad');
  body.appendChild(notepad);
  notepad.innerHTML = `<div class="note-links">
<div class="webnote logo">123456789</div>
<div onclick="addPageForNoteCreate()">
<img src="./note.png" class="nav-link" id="addFile">
<label for="addFile" class="addnew">add note</label>
</div>
</div>
<div class="notes">
<div class="under_note">
</div>
</div>
`;
  loadData();
}

// add note page
function addPageForNoteCreate()
{
  document.querySelector('.notepad').remove();
  let editingpage = document.createElement('div');
  editingpage.setAttribute('class', 'additemDiv');
  editingpage.innerHTML = `<div class="additemDiv">
  <div class="note-links">
    <div id="back" onclick="newiTemwithback()" class="webnote back">Back</div>
    <div id="save" onclick="addnewItem()" class="webnote">Save</div>
  </div>
  <textarea maxlength="250" class="bottom titleText">Ok this is heading </textarea>
  <br>
  <textarea class="bottom paper"></textarea>
</div>`;
  body.appendChild(editingpage);
}

// custom cursor for any devices
const cursor = document.querySelector('#cursor');
const center_to_X = cursor.offsetWidth / 2;
const center_to_Y = cursor.offsetHeight / 2;
document.body.addEventListener('mousemove', function(e){
  cursor.style.left = `${e.x - center_to_X}px`;
  cursor.style.top = `${e.y - center_to_Y}px`;
});

//  table created
createtable();
function createtable(){
db.transaction(function(transaction){
	var sql="CREATE TABLE items "+
	"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
	"title TEXT NOT NULL,"+
	"item TEXT NOT NULL)";
	transaction.executeSql(sql,undefined,function(){
	  return 0;
	},function(){
	  return 0;
  });
});
}

//  drop table
$("#remove").click(function(){
if(!confirm("Are you sure to delete this table?","")) return ;
db.transaction(function(transaction){
	var sql="DROP TABLE items";
	transaction.executeSql(sql,undefined,function(){
		alert("Table is deleted successfully");
	},function(transaction,err){
		alert(err.message);
	});
});
});

// insert data
function newiTemwithback(){
  document.querySelector('.additemDiv').remove();
  createHomePage();
}
function addnewItem (){
var item=$(".paper").val();
var title=$(".titleText").val();
db.transaction(function(transaction){
var sql="INSERT INTO items(title, item) VALUES(?,?)";
transaction.executeSql(sql,[title, item],function(){
	alert("New item is item added successfully");
},function(transaction,err){
	alert(err.message);
});
});
}

function loadData(){
		$(".under_note").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM items ORDER BY id DESC";
		transaction.executeSql(sql,undefined,function(transaction,result){
if(result.rows.length){
for(var i=0;i<result.rows.length;i++){
	var row=result.rows.item(i);
	var title=row.title;
	var item=row.item;
	var id=row.id;
	$(".under_note").append(`<div id="${id}" class="note_item" onclick="createshowpage(this.id)">
      <h5 class="heading">${title}</h5>
      <br>
      <small class="smdesc ">Read more...</small>
      </div>`);
}
}else{
	$(".under_note").append('<tr><td colspan="3" align="center">No Item Found</td></tr>');
}
		},function(transaction,err){
			alert('No table found. Create table now');
		});
	});
}

function createdetailpage (){
  let cont = document.createElement('div');
  cont.setAttribute('class','additemDiv');
  cont.innerHTML = `
  <div class="note-links">
    <div id="back" onclick="newiTemwithback()" class="webnote back">Back</div>
    <div id="delete" onclick="deleteitem()" class="webnote">Delete</div>
    <div id="edit" class="webnote">Edit</div>
  </div>
  <div class="bottom outofbtm" id="contentview"></div>`;
  body.appendChild(cont);
}

function loadDataDetail(inpi){
		$("#contentview").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM items where id=?";
		transaction.executeSql(sql,[inpi],function(transaction,result){
if(result.rows.length){
for(var i=0;i<result.rows.length;i++){
	var row=result.rows.item(i);
	var title=row.title;
	var item=row.item;
	var id=row.id;
	var inpid = inpi;
	$("#contentview").append(`<h4>${title}</h4>
  <br>
  <p>${item}</p>`);
}}},function(transaction,err){
			alert('No table found. Create table now');
		});
	});
}

function createshowpage(id){
  document.querySelector('.notepad').remove();
  createdetailpage();
  loadDataDetail(id);
	edit = id;
	launcer();
}

function launcer(){
  const editbtn = document.querySelector('#edit');
  editbtn.addEventListener('click', ()=>{
  addPageForNoteEdit(edit);
  });
}

function addPageForNoteEdit(inpi)
{
  document.querySelector('.additemDiv').remove();
  let editingpage = document.createElement('div');
  editingpage.setAttribute('class', 'additemDiv');
  body.appendChild(editingpage);
  $(".additemDiv").children().remove();
	db.transaction(function(transaction){
		var sql="SELECT * FROM items where id=?";
		transaction.executeSql(sql,[inpi],function(transaction,result){
if(result.rows.length){
for(var i=0;i<result.rows.length;i++){
	var row=result.rows.item(i);
	var title=row.title;
	var item=row.item;
	var id=row.id;
	var inpid = inpi;
	$(".additemDiv").append(`<div class="additemDiv">
  <div class="note-links">
    <div id="back" onclick="newiTemwithback()" class="webnote back">Back</div>
    <div id="update" onclick="updateItem()" class="webnote">Update</div>
  </div>
  <textarea maxlength="250" class="bottom titleText">${title}</textarea>
  <br>
  <textarea class="bottom paper">${item}</textarea>
</div>`);
}}},function(transaction,err){
			alert('No table found. Create table now');
		})
	})
}

function updateItem(){
var title=$(".titleText").val();
var item=$(".paper").val();
var id = edit;
db.transaction(function(transaction){
var sql="UPDATE items SET title=?, item=? where id=?";
transaction.executeSql(sql,[title,item,id],function(){
  alert("Item is updated successfully");
},function(transaction,err){
  alert(err.message);
})
})
}

function deleteitem(){
  var sure = confirm("Are you sure to delete this item?");
if(sure===true){
  db.transaction(function(transaction){
  var sql="DELETE FROM items where id=?";
  transaction.executeSql(sql,[edit],function(){
	document.querySelector('.additemDiv').remove();
	createHomePage();
},function(transaction,err){
	alert(err.message);
})
});
}
}


