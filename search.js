let students = [];

/* =====================================================
CSV ROW PARSER
===================================================== */

function parseCsvRow(line) {

```
const fields = [];
let cur = "";
let inQuotes = false;

for (let i = 0; i < line.length; i++) {

    const ch = line[i];

    if (ch === '"') {

        if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
        } else {
            inQuotes = !inQuotes;
        }

    } else if (ch === "," && !inQuotes) {

        fields.push(cur);
        cur = "";

    } else {

        cur += ch;
    }
}

fields.push(cur);

return fields.map(f =>
    f.trim().replace(/^"|"$/g, "")
);
```

}

/* =====================================================
LOAD STUDENT CSV
===================================================== */

fetch("student_data.csv")

```
.then(res => {

    if (!res.ok) {
        throw new Error("student_data.csv could not be loaded.");
    }

    return res.text();
})

.then(data => {

    // Handles Windows and normal line endings
    let rows = data.split(/\r?\n/);

    // Skip CSV heading row
    for (let i = 1; i < rows.length; i++) {

        const line = rows[i].trim();

        if (!line) continue;

        const cols = parseCsvRow(line);


        /* =================================================
           CSV COLUMN MAPPING

           0  = GRNO
           1  = NAME
           2  = F_NAME
           3  = GENDER
           4  = DOB
           5  = ADMISSION_CLASS
           6  = PRESENT_CLASS
           7  = SECTION
           8  = POLICYNO
           9  = CATEGORY
           10 = STUDY_GROUP
           11 = ACADEMIC_SESSION
           12 = CHILD
           13 = CAMPUS
           14 = ACC_NO
           15 = ADMISSION_DATE
           16 = STATUS_DATE
           17 = LEAVING_DATE
           18 = SECURITY_DATE
           19 = RES_PH
           20 = FATHER_CELL
           21 = MOTHER_CELL
           22 = PRESENT_ADDRESS
           23 = PICKUP_MODE
           24 = ACTIVE
           25 = CREATION
           26 = LAST_EDIT
           27 = STATUS
        ================================================= */


        students.push({

            gr: cols[0]?.trim() || "",

            name: cols[1]?.trim() || "",

            father: cols[2]?.trim() || "",

            gender: cols[3]?.trim() || "",

            dob: cols[4]?.trim() || "",

            admission_class: cols[5]?.trim() || "",

            p_class: cols[6]?.trim() || "",

            section: cols[7]?.trim() || "",

            policy: cols[8]?.trim() || "",

            category: cols[9]?.trim() || "",

            study_group: cols[10]?.trim() || "",

            academic_session: cols[11]?.trim() || "",

            child: cols[12]?.trim() || "",

            campus: cols[13]?.trim() || "",

            acc_no: cols[14]?.trim() || "",

            admission_date: cols[15]?.trim() || "",

            status_date: cols[16]?.trim() || "",

            leaving_date: cols[17]?.trim() || "",

            security_date: cols[18]?.trim() || "",

            res_ph: cols[19]?.trim() || "",

            father_cell: cols[20]?.trim() || "",

            mother_cell: cols[21]?.trim() || "",

            address: cols[22]?.trim() || "",

            pickup_mode: cols[23]?.trim() || "",

            active: cols[24]?.trim() || "",

            creation: cols[25]?.trim() || "",

            last_edit: cols[26]?.trim() || "",

            // LAST COLUMN
            status: cols[27]?.trim() || ""

        });
    }


    console.log("Student records loaded:", students.length);

    document.getElementById("searchStatus").innerHTML =
        "✅ " + students.length + " Student Record(s) Loaded";

})

.catch(error => {

    console.error("CSV Error:", error);

    document.getElementById("searchStatus").innerHTML =
        "❌ Error loading student_data.csv";

});
```

/* =====================================================
SEARCH STUDENT
===================================================== */

function searchStudent() {

```
const searchMessage =
    document.getElementById("searchStatus");

searchMessage.innerHTML = "Searching...";


/* =================================================
   GET SEARCH VALUES
================================================= */

const gr =
    document.getElementById("gr")?.value
    .toLowerCase()
    .trim() || "";


const name =
    document.getElementById("name")?.value
    .toLowerCase()
    .trim() || "";


const father =
    document.getElementById("father")?.value
    .toLowerCase()
    .trim() || "";


const p_class =
    document.getElementById("p_class")?.value
    .toLowerCase()
    .trim() || "";


const section =
    document.getElementById("section")?.value
    .toLowerCase()
    .trim() || "";


const contact =
    document.getElementById("contact")?.value
    .toLowerCase()
    .trim() || "";


const dob =
    document.getElementById("dob")?.value
    .toLowerCase()
    .trim() || "";


const campus =
    document.getElementById("campus")?.value
    .toLowerCase()
    .trim() || "";


const selectedStatus =
    document.getElementById("status")?.value
    .toLowerCase()
    .trim() || "";


/* =================================================
   FILTER STUDENTS
================================================= */

const result = students.filter(s => {

    const studentCampus =
        s.campus?.toLowerCase().trim() || "";


    const studentStatus =
        s.status?.toLowerCase().trim() || "";


    return (

        // GRNO
        (!gr ||
            s.gr?.toLowerCase().includes(gr))


        &&


        // STUDENT NAME
        (!name ||
            s.name?.toLowerCase().includes(name))


        &&


        // FATHER NAME
        (!father ||
            s.father?.toLowerCase().includes(father))


        &&


        // PRESENT CLASS
        (!p_class ||
            s.p_class?.toLowerCase().includes(p_class))


        &&


        // SECTION
        (!section ||
            s.section?.toLowerCase().includes(section))


        &&


        // CONTACT
        (
            !contact ||

            s.res_ph?.toLowerCase().includes(contact) ||

            s.father_cell?.toLowerCase().includes(contact) ||

            s.mother_cell?.toLowerCase().includes(contact)
        )


        &&


        // DOB
        (!dob ||
            s.dob?.toLowerCase().includes(dob))


        &&


        // CAMPUS
        (!campus ||
            studentCampus === campus)


        &&


        // STATUS
        (!selectedStatus ||
            studentStatus === selectedStatus)

    );

});


/* =================================================
   DISPLAY RESULTS
================================================= */

display(result);


/* =================================================
   SEARCH MESSAGE
================================================= */

if (result.length === 0) {

    searchMessage.innerHTML =
        "❌ No Record Found";

} else {

    searchMessage.innerHTML =
        "✅ " + result.length + " Record(s) Found";

}
```

}

/* =====================================================
DISPLAY STUDENTS
===================================================== */

function display(data) {

```
const table =
    document.querySelector("#result tbody");

table.innerHTML = "";


data.forEach((s, index) => {

    /* ---------------------------------------------
       Contact Number

       Priority:
       Father Cell → Mother Cell → Residence Phone
    --------------------------------------------- */

    const contact =
        s.father_cell ||
        s.mother_cell ||
        s.res_ph ||
        "";


    /* ---------------------------------------------
       STATUS
    --------------------------------------------- */

    const studentStatus =
        s.status?.trim() || "";


    const statusLower =
        studentStatus.toLowerCase();


    let statusClass = "";


    if (statusLower === "active") {

        statusClass = "active";

    } else if (
        statusLower === "inactive" ||
        statusLower === "in active"
    ) {

        statusClass = "inactive";

    }


    /* ---------------------------------------------
       TABLE ROW
    --------------------------------------------- */

    const row = `

        <tr>

            <td>${index + 1}</td>

            <td>${s.gr}</td>

            <td>${s.name}</td>

            <td>${s.father}</td>

            <td>${s.p_class}</td>

            <td>${s.section}</td>

            <td>${contact}</td>

            <td>${s.dob}</td>

            <td>${s.address}</td>

            <td>${s.campus}</td>

            <td class="status ${statusClass}">
                ${studentStatus}
            </td>

        </tr>

    `;


    table.innerHTML += row;

});
```

}
