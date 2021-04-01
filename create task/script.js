const situations = ["Active", "Passive", "On Hold"]


class Task {

    constructor(id, task_name, date, situation) {
        this.task_name = task_name;
        this.date = date;
        this.situation = situation;
        this.id = id;
    }

}


class UI {

    static reFillTable() {

        let data = Storage.getTasks()

        let tbody = document.getElementById("tbody")
        tbody.innerHTML = "";

        data.forEach(element => {
            let table_row = ` 
            <tr>
            <td>${element.id}</td>
            <td>${element.task_name}</td>
            <td>${element.date}</td>
            <td><select class="select_situation" data-id=${element.id}>                
            </select></td>
        </tr>
    `
            tbody.innerHTML += table_row

            let situationSelectArr = document.querySelectorAll("select");
            for (let i = 0; i < situations.length; i++) {

                situationSelectArr.forEach(element => {

                    var opt = new Option(situations[i], situations[i], element.situation == situations[i], element.situation == situations[i])

                    console.log(opt);
                    element.appendChild(opt);
                });
            }
        });


    }

    static showAlert(message, afterDom, className) {
        var alert = `
        <div class="alert alert-${className}">
            ${message}
        </div>`

        const row = document.querySelector(afterDom);
        //beforeBegin, afterBegin, beforeEnd, AfterEnd
        row.insertAdjacentHTML('afterend', alert);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static addmodalCloseAttr(domElement) {
        domElement.setAttribute("data-dismiss", "modal")
    }

    static removeModalCloseAttr(domElement) {
        domElement.removeAttribute("data-dissmiss")
    }

    static changeSituation(id, situation) {
        let tasks = Storage.getTasks();
        tasks.find(x => x.id == id).situation = situation;
        Storage.refreshLocalStorage("tasks", tasks)

    }

    static clearModal(elementArr = []) {

        for (let i = 0; i < elementArr.length; i++) {

            elementArr[i].value = ""

        }
    }

}

class Storage {

    static addToLocalStorage(storeKey, objValue, stringfy = false) {

        let tasks = this.getTasks();
        tasks.push(objValue);

        if (stringfy) {
            localStorage.setItem(storeKey, tasks)
        }
        localStorage.setItem(storeKey, JSON.stringify(tasks))

    }

    static getTasks() {
        let tasks = [];

        if (localStorage.getItem("tasks")) {
            tasks = JSON.parse(localStorage.getItem("tasks"))
            return tasks;
        } else {
            return tasks
        }
    }

    static refreshLocalStorage(key, value, stringfy = false) {
        localStorage.removeItem(key)
        if (stringfy) {
            localStorage.setItem(key, value)
        }
        localStorage.setItem(key, JSON.stringify(value))
    }
}


UI.reFillTable();

const submit_button = document.getElementById("submit_button")
submit_button.addEventListener("click", function (e) {
    e.defaultPrevented;
    let task = document.getElementById("task")
    let date = document.getElementById("date")

    if (task && date) {
        let addedTask = {};
        addedTask.task_name = task.value;
        addedTask.date = date.value;
        addedTask.situation = situations[0];
        addedTask.id = +Storage.getTasks().length + 1;
        Storage.addToLocalStorage("tasks", addedTask);
        UI.reFillTable();
        UI.clearModal([task, date])
        UI.showAlert("Göreviniz başarıyla eklendi", ".navbar", "success")
        UI.removeModalCloseAttr(submit_button)
    } else(

        UI.showAlert("Alanları doldurmak zorunludur", ".modal-header", "danger")

    )
})


const ekle_button = document.getElementById("ekle_button")
ekle_button.addEventListener("click", function (e) {
    UI.addmodalCloseAttr(submit_button);
})

const cancel_button = document.getElementById("cancel_button")
cancel_button.addEventListener("click", function (e) {
    UI.addmodalCloseAttr(submit_button);

})



const tbody = document.getElementById("tbody")
tbody.addEventListener("change", function (e) {
    console.log(e.target);

    if (e.target instanceof HTMLSelectElement) {

        switch (e.target.value) {
            case "Active":
                e.target.classList = "";
                e.target.classList.add("bg-success");
                UI.changeSituation(e.target.dataset.id, "Active")
                break;

            case "Passive":
                e.target.classList = ""
                e.target.classList.add("bg-danger")
                UI.changeSituation(e.target.dataset.id, "Passive")
                break

            case "On Hold":
                e.target.classList = ""
                e.target.classList.add("bg-warning")
                UI.changeSituation(e.target.dataset.id, "On Hold")
            default:
                break;
        }
    }
})