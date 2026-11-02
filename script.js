
let tasks = JSON.parse(localStorage.getItem("nestTasks")) || [];

function save() {
    localStorage.setItem("nestTasks", JSON.stringify(tasks));
}

function addTask() {
    let title = document.getElementById("task").value.trim();

    if (!title) return alert("Enter a task!");

    tasks.push({
        id: Date.now(), title,
        category: category.value,
        priority: priority.value,
        date: date.value, completed: false
    });

    task.value = "";
    date.value = "";
    save();
    showTasks();
}

function showTasks() {
    list.innerHTML = "";

    let data = tasks.filter(t =>
        t.title.toLowerCase().includes(search.value.toLowerCase()) &&
        (filter.value === "all" ||
        (filter.value === "pending" && !t.completed) ||
        (filter.value === "completed" && t.completed) ||
        (filter.value === "high" && t.priority === "High"))
    );

    if (sort.value === "new") data.reverse();
    if (sort.value === "priority") {
        data.sort((a, b) =>
            ["Low", "Medium", "High"].indexOf(b.priority) -
            ["Low", "Medium", "High"].indexOf(a.priority));
    }

    data.forEach(t => {
        let div = document.createElement("div");
        div.className = "task" + (t.completed ? " completed" : "");

        let check = document.createElement("input");
        check.type = "checkbox";
        check.checked = t.completed;
        check.onchange = () => {
            t.completed = check.checked;
            save(); showTasks();
        };

        let content = document.createElement("div");
        content.className = "task-content";
        content.textContent = t.title;

        let info = document.createElement("small");
        info.textContent = `${t.category} | ${t.priority} | ${t.date || "No deadline"}`;
        content.appendChild(info);

        let edit = document.createElement("button");
        edit.textContent = "✏️";
        edit.onclick = () => {
            let name = prompt("Edit task:", t.title);
            if (name && name.trim()) {
                t.title = name.trim();
                save(); showTasks();
            }
        };

        let del = document.createElement("button");
        del.textContent = "🗑️";
        del.onclick = () => {
            tasks = tasks.filter(x => x.id !== t.id);
            save(); showTasks();
        };

        div.append(check, content, edit, del);
        list.appendChild(div);
    });

    empty.style.display = data.length ? "none" : "block";
    updateStats();
}

function updateStats() {
    let completed = tasks.filter(t => t.completed).length;
    let total = tasks.length;
    let p = total ? Math.round(completed / total * 100) : 0;

    document.getElementById("total").textContent = total;
    document.getElementById("pending").textContent = total - completed;
    document.getElementById("done").textContent = completed;
    document.getElementById("percent").textContent = p + "%";
    document.getElementById("progressText").textContent = p + "%";
    document.getElementById("bar").style.width = p + "%";
}

function clearDone() {
    tasks = tasks.filter(t => !t.completed);
    save(); showTasks();
}

theme.onclick = () => {
    document.body.classList.toggle("light");
};

showTasks();
