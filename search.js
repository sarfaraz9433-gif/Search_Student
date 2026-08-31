let students = [];

/* =====================================================
CSV ROW PARSER

This parser handles commas inside "quoted" fields.

Example:
"H # F-2, SHEET # 26, MODEL COLONY, MALIR, KARACHI"

The complete address will remain in ONE column.
===================================================== */

function parseCsvRow(line) {

```
const fields = [];

let current = "";

let inQuotes = false;


for (let i = 0; i < line.length; i++) {

    const character = line[i];


    /* ---------------------------------------------
       QUOTATION MARK
    --------------------------------------------- */

    if (character === '"') {

        /*
         * Double quote inside quoted text
         */

        if (
            inQuotes &&
            line[i + 1] === '"'
        ) {

            current += '"';

            i++;

        }

        else {

            inQuotes = !inQuotes;

        }

    }


    /* ---------------------------------------------
       COMMA
    --------------------------------------------- */

    else if (
        character === "," &&
        !inQuotes
    ) {

        fields.push(current);

        current = "";

    }


    /* ---------------------------------------------
       NORMAL CHARACTER
    --------------------------------------------- */

    else {

        current += character;

    }

}


/*
 * Add last field
 */

fields.push(current);


/*
 * Remove unnecessary spaces and quotes
 */

return fields.map(field => {

    return field
        .trim()
        .replace(/^"|"$/g, "");

});
```

}

/* =====================================================
LOAD STUDENT DATA
===================================================== */

fetch("student_data.csv")

```
.then(response => {


    /* ---------------------------------------------
       CHECK CSV FILE
    --------------------------------------------- */

    if (!response.ok) {

        throw new Error(
            "student_data.csv could not be loaded."
        );

    }


    return response.text();

})


.then(data => {


    /*
     * Remove BOM if Excel added it
     */

    data = data.replace(
        /^\uFEFF/,
        ""
    );


    /*
     * Split rows
     */

    const rows =
        data.split(/\r?\n/);


    /*
     * Clear old data
     */

    students = [];


    /* =============================================
       READ EVERY CSV ROW
    ============================================= */

    for (
        let i = 1;
        i < rows.length;
        i++
    ) {


        const line =
            rows[i].trim();


        /*
         * Ignore empty rows
         */

        if (!line) {

            continue;

        }


        /*
         * Convert CSV row into columns
         */

        const cols =
            parseCsvRow(line);


        /*
         * Your CSV has 28 columns.

         * If fewer than 28 columns,
         * don't load the row.
         */

        if (cols.length < 28) {

            console.warn(
                "Row " +
                i +
                " skipped. Columns found: " +
                cols.length
            );

            continue;

        }


        /* =============================================
           STUDENT DATA

           CSV COLUMN SEQUENCE:

           0  GRNO
           1  NAME
           2  F_NAME
           3  GENDER
           4  DOB
           5  ADMISSION_CLASS
           6  PRESENT_CLASS
           7  SECTION
           8  POLICYNO
           9  CATEGORY
           10 STUDY_GROUP
           11 ACADEMIC_SESSION
           12 CHILD
           13 CAMPUS
           14 ACC_NO
           15 ADMISSION_DATE
           16 STATUS_DATE
           17 LEAVING_DATE
           18 SECURITY_DATE
           19 RES_PH
           20 FATHER_CELL
           21 MOTHER_CELL
           22 PRESENT_ADDRESS
           23 PICKUP_MODE
           24 ACTIVE
           25 CREATION
           26 LAST_EDIT
           27 STATUS
        ============================================= */


        students.push({

            /* 0 */

            gr:
                cols[0]?.trim() || "",


            /* 1 */

            name:
                cols[1]?.trim() || "",


            /* 2 */

            father:
                cols[2]?.trim() || "",


            /* 3 */

            gender:
                cols[3]?.trim() || "",


            /* 4 */

            dob:
                cols[4]?.trim() || "",


            /* 5 */

            admission_class:
                cols[5]?.trim() || "",


            /* 6 */

            p_class:
                cols[6]?.trim() || "",


            /* 7 */

            section:
                cols[7]?.trim() || "",


            /* 8 */

            policy_no:
                cols[8]?.trim() || "",


            /* 9 */

            category:
                cols[9]?.trim() || "",


            /* 10 */

            study_group:
                cols[10]?.trim() || "",


            /* 11 */

            academic_session:
                cols[11]?.trim() || "",


            /* 12 */

            child:
                cols[12]?.trim() || "",


            /* 13 */

            campus:
                cols[13]?.trim() || "",


            /* 14 */

            acc_no:
                cols[14]?.trim() || "",


            /* 15 */

            admission_date:
                cols[15]?.trim() || "",


            /* 16 */

            status_date:
                cols[16]?.trim() || "",


            /* 17 */

            leaving_date:
                cols[17]?.trim() || "",


            /* 18 */

            security_date:
                cols[18]?.trim() || "",


            /* 19 */

            res_ph:
                cols[19]?.trim() || "",


            /* 20 */

            father_cell:
                cols[20]?.trim() || "",


            /* 21 */

            mother_cell:
                cols[21]?.trim() || "",


            /* 22 */

            address:
                cols[22]?.trim() || "",


            /* 23 */

            pickup_mode:
                cols[23]?.trim() || "",


            /* 24 */

            active:
                cols[24]?.trim() || "",


            /* 25 */

            creation:
                cols[25]?.trim() || "",


            /* 26 */

            last_edit:
                cols[26]?.trim() || "",


            /* 27 - LAST COLUMN */

            status:
                cols[27]?.trim() || ""

        });

    }


    /* =============================================
       DATA LOADED
    ============================================= */


    console.log(
        "Total Student Records:",
        students.length
    );


    /*
     * Show loaded record count
     */

    document.getElementById(
        "searchStatus"
    ).innerHTML =

        "✅ " +
        students.length +
        " Student Record(s) Loaded";


    /*
     * Display all students initially
     */

    display(students);


})


.catch(error => {


    console.error(
        "CSV ERROR:",
        error
    );


    document.getElementById(
        "searchStatus"
    ).innerHTML =

        "❌ Error loading student_data.csv";


});
```

/* =====================================================
SEARCH STUDENT
===================================================== */

function searchStudent() {

```
/*
 * Search message
 */

const searchMessage =
    document.getElementById(
        "searchStatus"
    );


searchMessage.innerHTML =
    "Searching...";


/* =============================================
   GET SEARCH VALUES
============================================= */


/*
 * GR#
 */

const gr =
    document.getElementById("gr")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Student Name
 */

const name =
    document.getElementById("name")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Father Name
 */

const father =
    document.getElementById("father")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Present Class
 */

const p_class =
    document.getElementById("p_class")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Section
 */

const section =
    document.getElementById("section")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Contact
 */

const contact =
    document.getElementById("contact")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * DOB
 */

const dob =
    document.getElementById("dob")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Campus
 */

const campus =
    document.getElementById("campus")
        ?.value
        .toLowerCase()
        .trim() || "";


/*
 * Status

   Active
   In Active
   Inactive
*/

const selectedStatus =
    document.getElementById("status")
        ?.value
        .toLowerCase()
        .trim() || "";



/* =============================================
   FILTER STUDENTS
============================================= */

const result =
    students.filter(student => {


        /*
         * Convert student values to lowercase
         */

        const studentGR =
            (
                student.gr || ""
            ).toLowerCase();


        const studentName =
            (
                student.name || ""
            ).toLowerCase();


        const studentFather =
            (
                student.father || ""
            ).toLowerCase();


        const studentClass =
            (
                student.p_class || ""
            ).toLowerCase();


        const studentSection =
            (
                student.section || ""
            ).toLowerCase();


        const studentDOB =
            (
                student.dob || ""
            ).toLowerCase();


        const studentCampus =
            (
                student.campus || ""
            ).toLowerCase();


        const studentStatus =
            (
                student.status || ""
            ).toLowerCase();


        const resPhone =
            (
                student.res_ph || ""
            ).toLowerCase();


        const fatherPhone =
            (
                student.father_cell || ""
            ).toLowerCase();


        const motherPhone =
            (
                student.mother_cell || ""
            ).toLowerCase();



        /* =========================================
           RETURN MATCH
        ========================================= */

        return (


            /*
             * GR#
             */

            (
                !gr ||
                studentGR.includes(gr)
            )


            &&


            /*
             * NAME
             */

            (
                !name ||
                studentName.includes(name)
            )


            &&


            /*
             * FATHER NAME
             */

            (
                !father ||
                studentFather.includes(father)
            )


            &&


            /*
             * CLASS
             */

            (
                !p_class ||
                studentClass.includes(p_class)
            )


            &&


            /*
             * SECTION
             */

            (
                !section ||
                studentSection.includes(section)
            )


            &&


            /*
             * CONTACT

             Searches:

             RES_PH
             FATHER_CELL
             MOTHER_CELL
             */

            (
                !contact ||

                resPhone.includes(contact) ||

                fatherPhone.includes(contact) ||

                motherPhone.includes(contact)
            )


            &&


            /*
             * DOB
             */

            (
                !dob ||
                studentDOB.includes(dob)
            )


            &&


            /*
             * CAMPUS
             */

            (
                !campus ||
                studentCampus === campus
            )


            &&


            /*
             * STATUS

             Active
             In Active
             Inactive
             */

            (
                !selectedStatus ||
                studentStatus === selectedStatus
            )

        );

    });



/* =============================================
   DISPLAY SEARCH RESULT
============================================= */

display(result);



/* =============================================
   SEARCH RESULT MESSAGE
============================================= */

if (result.length === 0) {

    searchMessage.innerHTML =
        "❌ No Record Found";

}

else {

    searchMessage.innerHTML =

        "✅ " +
        result.length +
        " Record(s) Found";

}
```

}

/* =====================================================
DISPLAY STUDENTS
===================================================== */

function display(data) {

```
const table =
    document.querySelector(
        "#result tbody"
    );


/*
 * Empty existing table
 */

table.innerHTML = "";



/* =============================================
   DISPLAY EACH STUDENT
============================================= */

data.forEach(
    (student, index) => {


        /* =========================================
           CONTACT NUMBER
        =========================================

           Priority:

           Father Cell
           ↓
           Mother Cell
           ↓
           Residence Phone
        ========================================= */


        const contact =

            student.father_cell ||

            student.mother_cell ||

            student.res_ph ||

            "";



        /* =========================================
           STATUS
        ========================================= */

        const studentStatus =

            student.status
                ?.trim() || "";



        const statusLower =

            studentStatus
                .toLowerCase();


        let statusClass = "";



        /* =========================================
           ACTIVE
        ========================================= */

        if (
            statusLower ===
            "active"
        ) {

            statusClass =
                "active";

        }



        /* =========================================
           INACTIVE
        ========================================= */

        else if (

            statusLower ===
                "inactive"

            ||

            statusLower ===
                "in active"

        ) {

            statusClass =
                "inactive";

        }



        /* =========================================
           CREATE TABLE ROW
        ========================================= */

        const row = `

            <tr>


                <!-- S.NO -->

                <td>
                    ${index + 1}
                </td>


                <!-- GR -->

                <td>
                    ${student.gr}
                </td>


                <!-- NAME -->

                <td>
                    ${student.name}
                </td>


                <!-- FATHER -->

                <td>
                    ${student.father}
                </td>


                <!-- CLASS -->

                <td>
                    ${student.p_class}
                </td>


                <!-- SECTION -->

                <td>
                    ${student.section}
                </td>


                <!-- CONTACT -->

                <td>
                    ${contact}
                </td>


                <!-- DOB -->

                <td>
                    ${student.dob}
                </td>


                <!-- ADDRESS -->

                <td>
                    ${student.address}
                </td>


                <!-- CAMPUS -->

                <td>
                    ${student.campus}
                </td>


                <!-- STATUS -->

                <td class="status ${statusClass}">
                    ${studentStatus}
                </td>


            </tr>

        `;


        table.innerHTML += row;

    }
);
```

}

/* =====================================================
CLEAR SEARCH
===================================================== */

function clearSearch() {

```
/*
 * Clear GR
 */

document.getElementById(
    "gr"
).value = "";


/*
 * Clear Name
 */

document.getElementById(
    "name"
).value = "";


/*
 * Clear Father
 */

document.getElementById(
    "father"
).value = "";


/*
 * Clear Class
 */

document.getElementById(
    "p_class"
).value = "";


/*
 * Clear Section
 */

document.getElementById(
    "section"
).value = "";


/*
 * Clear Contact
 */

document.getElementById(
    "contact"
).value = "";


/*
 * Clear DOB
 */

document.getElementById(
    "dob"
).value = "";


/*
 * Clear Campus
 */

document.getElementById(
    "campus"
).value = "";


/*
 * Clear Status
 */

document.getElementById(
    "status"
).value = "";


/*
 * Show all students
 */

display(students);


/*
 * Message
 */

document.getElementById(
    "searchStatus"
).innerHTML =

    "Showing all " +
    students.length +
    " students";
```

}
