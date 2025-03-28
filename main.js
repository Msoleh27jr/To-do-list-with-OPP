class ToDoList{
    constructor(url){
        this.url = url
        this.box = document.querySelector(".box")
        this.Emodal = document.querySelector(".Emodal")
        this.Eform = document.querySelector(".Eform")
        this.EConcel = document.querySelector(".EConcel")
        this.information = document.querySelector(".information")
        this.btnConcel = document.querySelector(".btnConcel")
        this.names = document.querySelector(".names")
        this.infor = document.querySelector(".infor")
        this.ids = document.querySelector(".ids")
        this.modal = document.querySelector(".modal")
        this.form = document.querySelector(".form")
        this.Concel = document.querySelector(".Concel")
        this.addbtn = document.querySelector(".addbtn")
        this.sort = document.querySelector(".sort")
        this.Search = document.querySelector(".Search")
        this.select = document.querySelector(".select")
        this.get()
        this.Search.oninput = () => {
            this.funSearch()
        }
        this.sort.onclick = () => {
            this.funSort()
        }
        this.addbtn.onclick = () => {
            this.modal.showModal()
            this.Concel.onclick = () => {this.modal.close()}
            this.funAdd()
        }
        this.select.onclick = () => {
            this.funSelect()
        }
    }
    async funSort(){
        try {   
            let response = await fetch(`${this.url}?sortBy=name`)
            let data = await response.json()
            this.getDate(data)
        } catch (error) {
            console.error(error);
        }
    }
    async funSearch(){
        try {
            let response = await fetch(`${this.url}?name=${this.Search.value}`)
            let data = await response.json()
            this.getDate(data)
        } catch (error) {
            console.error(error);
        }
    }
    async funSelect(){
        if(this.select.value != "all"){
            try {
                let response = await fetch(`${this.url}?status=${this.select.value}`)
                let data = await response.json()
                this.getDate(data)
            } catch (error) {
                console.error(error);
            }
        }
        else {
            this.get()
        }
        }
    async get(){
        let prom = await fetch(this.url)
        let data = await prom.json()
        this.getDate(data)
    }
    async funCheck(ele){
        try {
            await fetch(`${this.url}/${ele.id}` , {
                method : "PUT" ,
                headers : {"Content-type":"application/json"} ,
                body : JSON.stringify({...ele , status : !ele.status})
            })
           this.get()
        } catch (error) {
            console.error(error);
        }
    }
    async funDel(id){
        try {
            await fetch(`${this.url}/${id}` , {
                method : "DELETE"
            })
            this.get()
        } catch (error) {
            console.error(error);
        }
    }
    async funAdd(){
        this.form.onsubmit = async (event) => {
            event.preventDefault()
            try {
                await fetch(this.url , {
                    method : "POST" ,
                    headers : {"Content-Type":"application/json"} ,
                    body : JSON.stringify({name : event.target["name"].value , discription : event.target["Description"].value , status : false})
                })
                this.get()
                this.modal.close()
            } catch (error) {
                console.error(error);
            }
        }
    }
    async funEdit(id){
        this.Eform.onsubmit = async (event) => {
            event.preventDefault()
            try {
                await fetch(`${this.url}/${id}` , {
                    method : "PUT" ,
                    headers : {"Content-type":"application/json"} ,
                    body : JSON.stringify({name : event.target["Ename"].value , discription : event.target["EDescription"].value})
                })
                this.get()
                this.Emodal.close()
            } catch (error) {
                console.error(error);
            }
        }
    }
    getDate(data){
        this.box.innerHTML = ""
        data.forEach((e)=> {
            let contener = document.createElement("div")
            contener.classList.add("addDiv")
            let name = document.createElement("h3")
            name.style.textDecoration = e.status ? "none" : "line-through"
            name.innerHTML = e.name 
            let dis = document.createElement("p")
            dis.innerHTML = e.discription
            let status = document.createElement("input")
            status.type = "checkbox"
            status.checked = e.status
            status.onclick = () => {
                this.funCheck(e)
                console.log(e);
                
            }
            let delbtn = document.createElement("button")
            delbtn.style.backgroundColor = "transparent"
            delbtn.style.border = "none"
            delbtn.innerHTML = "🗑️"
            delbtn.onclick = () => {
                this.funDel(e.id)
            }
            let editbtn = document.createElement("button")
            editbtn.style.backgroundColor = "transparent"
            editbtn.style.border = "none"
            editbtn.innerHTML = "🆕"
            editbtn.onclick = () => {
                this.Emodal.showModal()
                this.EConcel.onclick = () => this.Emodal.close()
                this.Eform["Ename"].value = e.name
                this.Eform["EDescription"].value = e.discription
                this.funEdit(e.id)
            }
            let infobtn = document.createElement("button")
            infobtn.innerHTML = "ℹ️"
            infobtn.style.border = "none"
            infobtn.style.backgroundColor = "transparent"
            infobtn.onclick = () => {
                this.information.showModal()
                this.ids.innerHTML = e.id
                this.names.innerHTML = e.name
                this.infor.innerHTML = e.discription
                this.btnConcel.onclick = () => {
                    this.information.close()
                }
            }
            contener.append(name , dis , status , delbtn , editbtn , infobtn)
            this.box.append(contener)
        })
    }
}
new ToDoList("https://67d5514bd2c7857431f00311.mockapi.io/Users")