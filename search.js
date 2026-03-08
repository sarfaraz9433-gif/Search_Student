let students=[];

fetch("student_data.csv")
.then(res=>res.text())
.then(data=>{

let rows=data.split("\n");

for(let i=1;i<rows.length;i++){

let cols=rows[i].split(",");

students.push({

gr:cols[0]?.trim(),
name:cols[1]?.trim(),
father:cols[2]?.trim(),
p_class:cols[3]?.trim(),
section:cols[4]?.trim(),
contact:cols[7]?.trim(),
address:cols[9]?.trim(),
campus:cols[10]?.trim()

});

}

});


function searchStudent(){

let status=document.getElementById("searchStatus");
status.innerHTML="Searching...";

let gr=document.getElementById("gr")?.value.toLowerCase().trim()||"";
let name=document.getElementById("name")?.value.toLowerCase().trim()||"";
let father=document.getElementById("father")?.value.toLowerCase().trim()||"";
let p_class=document.getElementById("p_class")?.value.toLowerCase().trim()||"";
let section=document.getElementById("section")?.value.toLowerCase().trim()||"";
let contact=document.getElementById("contact")?.value.trim()||"";
let campus=document.getElementById("campus")?.value.trim()||"";


let result=students.filter(s=>

(!gr || s.gr?.toLowerCase().includes(gr)) &&
(!name || s.name?.toLowerCase().includes(name)) &&
(!father || s.father?.toLowerCase().includes(father)) &&
(!p_class || s.p_class?.toLowerCase().includes(p_class)) &&
(!section || s.section?.toLowerCase().includes(section)) &&
(!contact || s.contact?.includes(contact)) &&
(!campus || s.campus===campus)

);

display(result);

if(result.length==0){

status.innerHTML="❌ No Record Found";

}else{

status.innerHTML="✅ "+result.length+" Record(s) Found";

}

}


function display(data){

let table=document.querySelector("#result tbody");

table.innerHTML="";

data.forEach((s,index)=>{

let row=`
<tr>
<td>${index+1}</td>
<td>${s.gr}</td>
<td>${s.name}</td>
<td>${s.father}</td>
<td>${s.p_class}</td>
<td>${s.section}</td>
<td>${s.contact}</td>
<td>${s.address}</td>
<td>${s.campus}</td>
</tr>
`;

table.innerHTML+=row;

});

}