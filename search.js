/* =========================================================
   STUDENT SEARCH SYSTEM
   ========================================================= */

let students = [];


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadStudentData();

});


/* =========================================================
   LOAD CSV
========================================================= */

function loadStudentData() {

    setStatus("⏳ Loading student data...");


    fetch("student_data.csv", {
        cache: "no-store"
    })

    .then(function (response) {

        console.log(
            "CSV HTTP Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "student_data.csv could not be loaded. HTTP " +
                response.status
            );

        }


        return response.text();

    })


    .then(function (data) {

        /*
         * Remove BOM
         */

        data =
            data.replace(/^\uFEFF/, "");


        /*
         * Parse CSV
         */

        students =
            parseCSV(data);


        console.log(
            "======================================"
        );

        console.log(
            "CSV LOADING COMPLETE"
        );

        console.log(
            "Total Student Records:",
            students.length
        );

        console.log(
            "======================================"
        );


        /*
         * Show first record
         */

        if (students.length > 0) {

            console.log(
                "FIRST STUDENT:",
                students[0]
            );

        }


        /*
         * Display all students
         */

        display(students);


        /*
         * Message
         */

        setStatus(
            "✅ " +
            students.length +
            " Student Record(s) Loaded"
        );

    })


    .catch(function (error) {

        console.error(
            "CSV ERROR:",
            error
        );


        setStatus(
            "❌ Error loading student_data.csv"
        );

    });

}


/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(data) {

    const rows = [];

    let row = [];

    let field = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        const char =
            data[i];


        /* =================================================
           QUOTED FIELD
        ================================================= */

        if (char === '"') {

            /*
             * Double quote inside quoted field
             */

            if (
                insideQuotes &&
                data[i + 1] === '"'
            ) {

                field += '"';

                i++;

            }

            else {

                insideQuotes =
                    !insideQuotes;

            }

        }


        /* =================================================
           COMMA
        ================================================= */

        else if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(
                cleanValue(field)
            );

            field = "";

        }


        /* =================================================
           NEW LINE
        ================================================= */

        else if (
            (char === "\n" ||
             char === "\r") &&
            !insideQuotes
        ) {

            /*
             * Windows CRLF
             */

            if (
                char === "\r" &&
                data[i + 1] === "\n"
            ) {

                i++;

            }


            row.push(
                cleanValue(field)
            );


            /*
             * Ignore completely empty rows
             */

            if (
                row.length > 1 ||
                row[0] !== ""
            ) {

                rows.push(row);

            }


            row = [];

            field = "";

        }


        /* =================================================
           NORMAL CHARACTER
        ================================================= */

        else {

            field += char;

        }

    }


    /*
     * Last field
     */

    row.push(
        cleanValue(field)
    );


    /*
     * Last row
     */

    if (
        row.length > 1 ||
        row[0] !== ""
    ) {

        rows.push(row);

    }


    /*
     * No CSV rows
     */

    if (rows.length === 0) {

        console.error(
            "CSV contains no rows."
        );

        return [];

    }


    /* =====================================================
       HEADER
    ===================================================== */

    const header =
        rows[0];


    console.log(
        "CSV HEADINGS:",
        header
    );


    console.log(
        "CSV COLUMN COUNT:",
        header.length
    );


    /*
     * Check expected columns
     */

    if (header.length !== 28) {

        console.warn(
            "WARNING: Expected 28 columns but header has " +
            header.length
        );

    }


    /* =====================================================
       STUDENT DATA
    ===================================================== */

    const result = [];


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const cols =
            rows[i];


        /*
         * Ignore empty rows
         */

        if (
            cols.length === 1 &&
            cols[0] === ""
        ) {

            continue;

        }


        /*
         * Check columns
         */

        if (cols.length < 28) {

            console.warn(
                "ROW SKIPPED:",
                i + 1,
                "Expected 28 columns but found:",
                cols.length,
                cols
            );

            continue;

        }


        /*
         * Create student object
         */

        const student = {

            gr:
                cols[0],

            name:
                cols[1],

            father:
                cols[2],

            gender:
                cols[3],

            dob:
                cols[4],

            admission_class:
                cols[5],

            p_class:
                cols[6],

            section:
                cols[7],

            policy_no:
                cols[8],

            category:
                cols[9],

            study_group:
                cols[10],

            academic_session:
                cols[11],

            child:
                cols[12],

            campus:
                cols[13],

            acc_no:
                cols[14],

            admission_date:
                cols[15],

            status_date:
                cols[16],

            leaving_date:
                cols[17],

            security_date:
                cols[18],

            res_ph:
                cols[19],

            father_cell:
                cols[20],

            mother_cell:
                cols[21],

            address:
                cols[22],

            pickup_mode:
                cols[23],

            active:
                cols[24],

            creation:
                cols[25],

            last_edit:
                cols[26],

            status:
                cols[27]

        };


        result.push(student);

    }


    return result;

}


/* =========================================================
   CLEAN CSV VALUE
========================================================= */

function cleanValue(value) {

    return String(value || "")
        .replace(/^\uFEFF/, "")
        .trim()
        .replace(/^"|"$/g, "")
        .trim();

}


/* =========================================================
   TEXT NORMALIZATION
========================================================= */

function normalize(value) {

    return String(value || "")
        .toLowerCase()
        .trim();

}


/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function normalizePhone(value) {

    return String(value || "")
        .replace(/\D/g, "");

}


/* =========================================================
   STATUS NORMALIZATION
========================================================= */

function normalizeStatus(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/[\s\-_]/g, "")
        .trim();

}


/* =========================================================
   GET INPUT VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            "Input not found:",
            id
        );

        return "";

    }


    return normalize(
        element.value
    );

}


/* =========================================================
   SEARCH STUDENT
========================================================= */

function searchStudent() {

    if (students.length === 0) {

        setStatus(
            "⚠️ Student data is not loaded."
        );

        return;

    }


    /*
     * Search values
     */

    const gr =
        getValue("gr");

    const name =
        getValue("name");

    const father =
        getValue("father");

    const pClass =
        getValue("p_class");

    const section =
        getValue("section");

    const contact =
        getValue("contact");

    const dob =
        getValue("dob");

    const campus =
        getValue("campus");

    const status =
        getValue("status");


    /*
     * Debug
     */

    console.log(
        "SEARCH:",
        {
            gr,
            name,
            father,
            pClass,
            section,
            contact,
            dob,
            campus,
            status
        }
    );


    /* =====================================================
       FILTER
    ===================================================== */

    const result =
        students.filter(function (student) {


            /* =============================================
               GR
            ============================================= */

            const matchGR =

                !gr ||

                normalize(
                    student.gr
                ).includes(gr);


            /* =============================================
               NAME
            ============================================= */

            const matchName =

                !name ||

                normalize(
                    student.name
                ).includes(name);


            /* =============================================
               FATHER
            ============================================= */

            const matchFather =

                !father ||

                normalize(
                    student.father
                ).includes(father);


            /* =============================================
               CLASS
            ============================================= */

            const matchClass =

                !pClass ||

                normalize(
                    student.p_class
                ).includes(pClass);


            /* =============================================
               SECTION
            ============================================= */

            const matchSection =

                !section ||

                normalize(
                    student.section
                ).includes(section);


            /* =============================================
               CONTACT
            ============================================= */

            const searchPhone =
                normalizePhone(
                    contact
                );


            const matchContact =

                !contact ||

                normalizePhone(
                    student.res_ph
                ).includes(
                    searchPhone
                ) ||

                normalizePhone(
                    student.father_cell
                ).includes(
                    searchPhone
                ) ||

                normalizePhone(
                    student.mother_cell
                ).includes(
                    searchPhone
                );


            /* =============================================
               DOB
            ============================================= */

            const matchDOB =

                !dob ||

                normalize(
                    student.dob
                ).includes(
                    dob
                );


            /* =============================================
               CAMPUS
            ============================================= */

            const matchCampus =

                !campus ||

                normalize(
                    student.campus
                ) ===
                normalize(
                    campus
                );


            /* =============================================
               STATUS
            ============================================= */

            const matchStatus =

                !status ||

                normalizeStatus(
                    student.status
                ) ===

                normalizeStatus(
                    status
                );


            /* =============================================
               ALL CONDITIONS
            ============================================= */

            return (

                matchGR &&

                matchName &&

                matchFather &&

                matchClass &&

                matchSection &&

                matchContact &&

                matchDOB &&

                matchCampus &&

                matchStatus

            );

        });


    /*
     * Display result
     */

    display(result);


    /*
     * Search message
     */

    if (result.length === 0) {

        setStatus(
            "❌ No Record Found"
        );

    }

    else {

        setStatus(
            "✅ " +
            result.length +
            " Record(s) Found"
        );

    }

}


/* =========================================================
   DISPLAY STUDENTS
========================================================= */

function display(data) {

    const tbody =
        document.querySelector(
            "#result tbody"
        );


    /*
     * Make sure table exists
     */

    if (!tbody) {

        console.error(
            "ERROR: #result tbody not found."
        );

        return;

    }


    /*
     * Clear table
     */

    tbody.innerHTML = "";


    /*
     * No results
     */

    if (
        !data ||
        data.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="11">
                No records found
            </td>
        `;


        tbody.appendChild(row);

        return;

    }


    /* =====================================================
       CREATE ROWS
    ===================================================== */

    data.forEach(
        function (student, index) {


            /*
             * Contact priority:
             *
             * Father Cell
             * Mother Cell
             * Residence
             */

            const contact =

                student.father_cell ||

                student.mother_cell ||

                student.res_ph ||

                "";


            /*
             * Status
             */

            const statusText =

                String(
                    student.status || ""
                ).trim();


            const normalizedStatus =
                normalizeStatus(
                    statusText
                );


            let statusClass = "";


            if (
                normalizedStatus ===
                "active"
            ) {

                statusClass =
                    "active";

            }

            else if (
                normalizedStatus ===
                "inactive"
            ) {

                statusClass =
                    "inactive";

            }


            /*
             * Create row
             */

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(index + 1)}
                </td>

                <td>
                    ${escapeHTML(student.gr)}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.father)}
                </td>

                <td>
                    ${escapeHTML(student.p_class)}
                </td>

                <td>
                    ${escapeHTML(student.section)}
                </td>

                <td>
                    ${escapeHTML(contact)}
                </td>

                <td>
                    ${escapeHTML(student.dob)}
                </td>

                <td>
                    ${escapeHTML(student.address)}
                </td>

                <td>
                    ${escapeHTML(student.campus)}
                </td>

                <td class="status ${statusClass}">
                    ${escapeHTML(statusText)}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CLEAR SEARCH
========================================================= */

function clearSearch() {

    const fields = [

        "gr",
        "name",
        "father",
        "p_class",
        "section",
        "contact",
        "dob",
        "campus",
        "status"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    /*
     * Show all students
     */

    display(students);


    /*
     * Message
     */

    setStatus(

        "Showing all " +
        students.length +
        " students"

    );

}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function setStatus(message) {

    const element =
        document.getElementById(
            "searchStatus"
        );


    if (element) {

        element.innerHTML =
            message;

    }

}


/* =========================================================
   ENTER KEY SEARCH
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            event.target.matches(
                "#gr, #name, #father, #p_class, #section, #contact, #dob"
            )
        ) {

            searchStudent();

        }

    }
);
