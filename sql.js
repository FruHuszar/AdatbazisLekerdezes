// Inicilizáljuk az SQL.js-t
initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` }).then(SQL => {
    const db = new SQL.Database();

    // 2 tábla feltöltése
    db.run(`
        CREATE TABLE Parent (parent_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, phone TEXT, email TEXT);
        CREATE TABLE Class (class_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
        CREATE TABLE Student (student_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, birth_date TEXT NOT NULL, address TEXT, class_id INTEGER, parent_id INTEGER, FOREIGN KEY (class_id) REFERENCES Class(class_id), FOREIGN KEY (parent_id) REFERENCES Parent(parent_id));
        CREATE TABLE Subject (subject_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
        CREATE TABLE StudentSubject (student_id INTEGER NOT NULL, subject_id INTEGER NOT NULL, year INTEGER NOT NULL, grade NUMERIC, PRIMARY KEY (student_id, subject_id, year), FOREIGN KEY (student_id) REFERENCES Student(student_id), FOREIGN KEY (subject_id) REFERENCES Subject(subject_id));

        INSERT INTO Parent (parent_id, first_name, last_name, phone, email) VALUES (1,'Anna','Nagy','123456789','anna@example.com'), (2,'Béla','Kovács','987654321','bela@example.com');
        INSERT INTO Class (class_id, name) VALUES (1,'9.A'), (2,'10.B');
        INSERT INTO Student (student_id, first_name, last_name, birth_date, address, class_id, parent_id) VALUES 
          (1,'József','Kovács','2008-04-12','Budapest',1,1),
          (2,'Eszter','Tóth','2007-09-30','Debrecen',2,2);
        INSERT INTO Subject (subject_id, name) VALUES (1,'Matematika'),(2,'Fizika');
        INSERT INTO StudentSubject (student_id, subject_id, year, grade) VALUES 
          (1,1,2025,4.5),
          (1,2,2025,3.0),
          (2,1,2025,5.0),
          (2,2,2025,4.0);
        `);

    const runBtn = document.getElementById('runBtn');
    const sqlInput = document.getElementById('sqlInput');
    const resultEl = document.getElementById('result');

    runBtn.addEventListener('click', () => {
        const query = sqlInput.value;
        try {
            const res = db.exec(query);
            if(res.length === 0) {
                resultEl.textContent = 'Nincs eredmény.';
            } else {
                // csak az első táblázatot írjuk ki
                const columns = res[0].columns;
                const values = res[0].values;
                let text = columns.join('\t') + '\n';
                values.forEach(row => {
                    text += row.join('\t') + '\n';
                });
                resultEl.textContent = text;
            }
        } catch(e) {
            resultEl.textContent = 'Valami félrement :((\n● ' + e.message;
        }
    });
});