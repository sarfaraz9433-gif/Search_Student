/* =========================================================
   STUDENT SEARCH DASHBOARD
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
                "Could not load student_data.csv. HTTP " +
                response.status
            );

        }


        return response.text();

    })


    .then(function (data) {

        /*
         * Remove Excel BOM
         */

        data =
            data.replace(/^\uFEFF/, "");


        /*
         * Check CSV
         */

        if (!data.trim()) {

            throw new Error(
                "student_data.csv is empty."
            );

        }


        /*
         * Parse CSV
         */

        students =
            parseCSV(data);


        console.log(
            "================================"
        );

        console.log(
            "CSV LOADED SUCCESSFULLY"
        );

        console.log(
            "Total Records:",
            students.length
        );

        console.log(
            "================================"
        );


        /*
         * Show first record
         */

        if (students.length > 0) {

            console.log(
                "First Student:",
                students[0]
            );

        }


        /*
         * Display all students
         */

        display(students);


        /*
         * Update message
         */

        setStatus(
            "✅ " +
            students.length +
            " Student Record(s) Loaded"
        );

    })


    .catch(function (error) {

        console.error(
            "================================"
        );

        console.error(
            "CSV ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================"
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
           QUOTES
        ================================================= */

        if (char === '"') {

            /*
             * Escaped quote ""
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


            /*
             * Add final field
             */

            row.push(
                cleanValue(field)
            );


            /*
             * Save row
             */

            if (
                row.length > 1 ||
                row[0] !== ""
            ) {

                rows.push(row);

            }


            /*
             * Reset
             */

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
     * Add final row
     */

    row.push(
        cleanValue(field)
    );


    if (
        row.length > 1 ||
        row[0] !== ""
    ) {

        rows.push(row);

    }


    /*
     * No data
     */

    if (rows.length === 0) {

        return [];

    }


    /*
     * Header
     */

    console.log(
        "CSV Header:",
        rows[0]
    );

    console.log(
        "CSV Column Count:",
        rows[0].length
    );


    /*
     * Convert rows to objects
     */

    const result = [];


    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const cols =
            rows[i];


        /*
         * Skip empty rows
         */

        if (
            cols.length === 1 &&
            !cols[0]
        ) {

            continue;

        }


        /*
         * Expected 28 columns
         */

        if (cols.length < 28) {

            console.warn(
                "Row " +
                (i + 1) +
                " skipped.",
                "Expected 28 columns.",
                "Found:",
                cols.length,
                cols
            );

            continue;

        }


        /*
         * Student object
         */

        result.push({

            gr:
                cols[0] || "",

            name:
                cols[1] || "",

            father:
                cols[2] || "",

            gender:
                cols[3] || "",

            dob:
                cols[4] || "",

            admission_class:
                cols[5] || "",

            p_class:
                cols[6] || "",

            section:
                cols[7] || "",

            policy_no:
                cols[8] || "",

            category:
                cols[9] || "",

            study_group:
                cols[10] || "",

            academic_session:
                cols[11] || "",

            child:
                cols[12] || "",

            campus:
                cols[13] || "",

            acc_no:
                cols[14] || "",

            admission_date:
                cols[15] || "",

            status_date:
                cols[16] || "",

            leaving_date:
                cols[17] || "",

            security_date:
                cols[18] || "",

            res_ph:
                cols[19] || "",

            father_cell:
                cols[20] || "",

            mother_cell:
                cols[21] || "",

            address:
                cols[22] || "",

            pickup_mode:
                cols[23] || "",

            active:
                cols[24] || "",

            creation:
                cols[25] || "",

            last_edit:
                cols[26] || "",

            status:
                cols[27] || ""

        });

    }


    return result;

}


/* =========================================================
   CLEAN CSV VALUE
========================================================= */

function cleanValue(value) {

    return String(value || "")
        .trim()
        .replace(/^"|"$/g, "")
        .trim();

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalize(value) {

    return String(value || "")
        .toLowerCase()
        .trim();

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(value) {

    return String(value || "")
        .replace(/[\s\-()+]/g, "")
        .trim();

}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/[\s\-_]/g, "")
        .trim();

}


/* =========================================================
   GET FIELD VALUE
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            "Element not found:",
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

    /*
     * Check data
     */

    if (students.length === 0) {

        setStatus(
            "⚠️ No student data loaded."
        );

        return;

    }


    setStatus(
        "🔍 Searching..."
    );


    /* =====================================================
       SEARCH VALUES
    ===================================================== */

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
        "Search Values:",
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


            /*
             * Student values
             */

            const studentGR =
                normalize(student.gr);

            const studentName =
                normalize(student.name);

            const studentFather =
                normalize(student.father);

            const studentClass =
                normalize(student.p_class);

            const studentSection =
                normalize(student.section);

            const studentDOB =
                normalize(student.dob);

            const studentCampus =
                normalize(student.campus);

            const studentStatus =
                normalizeStatus(
                    student.status
                );


            /*
             * Contact
             */

            const residencePhone =
                normalizePhone(
                    student.res_ph
                );

            const fatherPhone =
                normalizePhone(
                    student.father_cell
                );

            const motherPhone =
                normalizePhone(
                    student.mother_cell
                );

            const searchPhone =
                normalizePhone(
                    contact
                );


            /* =================================================
               CONDITIONS
            ================================================= */

            const matchGR =

                !gr ||
                studentGR.includes(gr);


            const matchName =

                !name ||
                studentName.includes(name);


            const matchFather =

                !father ||
                studentFather.includes(father);


            const matchClass =

                !pClass ||
                studentClass.includes(pClass);


            const matchSection =

                !section ||
                studentSection.includes(section);


            const matchContact =

                !contact ||

                residencePhone.includes(
                    searchPhone
                ) ||

                fatherPhone.includes(
                    searchPhone
                ) ||

                motherPhone.includes(
                    searchPhone
                );


            const matchDOB =

                !dob ||
                studentDOB.includes(dob);


            const matchCampus =

                !campus ||
                studentCampus === campus;


            const matchStatus =

                !status ||
                studentStatus ===
                normalizeStatus(status);


            /*
             * ALL fields must match
             */

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
     * Display
     */

    display(result);


    /*
     * Message
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
     * Check table
     */

    if (!tbody) {

        console.error(
            'ERROR: #result tbody not found.'
        );

        return;

    }


    /*
     * Clear old records
     */

    tbody.innerHTML = "";


    /*
     * No records
     */

    if (
        !data ||
        data.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td
                colspan="11"
                style="text-align:center;"
            >
                No records found
            </td>
        `;


        tbody.appendChild(row);

        return;

    }


    /* =====================================================
       DISPLAY EACH RECORD
    ===================================================== */

    data.forEach(function (
        student,
        index
    ) {


        /*
         * Contact priority
         *
         * Father
         * Mother
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

        const studentStatus =
            String(
                student.status || ""
            ).trim();


        const statusNormalized =
            normalizeStatus(
                studentStatus
            );


        let statusClass = "";


        if (
            statusNormalized ===
            "active"
        ) {

            statusClass =
                "active";

        }

        else if (
            statusNormalized ===
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
                ${escapeHTML(studentStatus)}
            </td>

        `;


        tbody.appendChild(row);

    });


    console.log(
        "Displayed:",
        data.length,
        "records"
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


    /*
     * Clear all inputs
     */

    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    /*
     * Display all students
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
