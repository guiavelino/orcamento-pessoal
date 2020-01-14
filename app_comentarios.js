/*A função LocalStorage retorna um objeto de manipulação do LocalStorage do browser, 
o método setItem recebe dois parâmetros, o primeiro e a identificaçaõ(id) do objeto que será armazenado,
o segundo é o valor que será armazenado que deve ser encaminnhado através de uma notação JSON 
pelo uso do objeto JSON e a partir dele executar a função stringfy() passando com parâmetro o objeto literal. 
   
JSON.stringfy() === Converte um objeto literal em uma string JSON
JSON.parse() === Converte uma string JSON em um objeto literal 
*/

//A função getItem() retorna um dado dentro de local storage

//A função setItem() insere um dado dentro de local storage

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        //Recuperação dos atributos do objeto despesa e armazenando na variável i.
        for (let i in this) {
            /*Recuperação dos valores dos atributos da variável i, this[i] recupera todos os valores sendo igual a,
             this.ano, this.mes, this.dia, this.tipo, this.descricao, this.valor*/
            if (this[i] == undefined || this[i] == '' || this[i] == null) { return false }
        }

        return true
    }
}

class Bd {
    constructor() {
        //A variável id recebe a chave id 
        let id = localStorage.getItem('id')

        //O valor de id é nulo, porque não existe a chave id, logo é realizado um teste para a definição dessa chave atribuindo o valor 0   
        if (id === null) {
            //Definição do par chave e valor 
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        /*O método getProximoId se inicia com a variável proximoId recebendo o valor da chave id, ou seja, 0. 
        E retorna o valor da variável proximoId + 1*/
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        //A variável id recebe o retorno do método getProximoId(), ou seja, o valor 1.
        let id = this.getProximoId()

        //A chave id é igual ao valor da váriavel id, ou seja, 1. E o valor é igual as informações do objeto despesa que está sendo referênciado através do parâmetro d.
        localStorage.setItem(id, JSON.stringify(d))

        //A chave id recebe o valor da variável id, ou seja, 1. 
        localStorage.setItem('id', id)

        /*Após o click no botão de adicionar a função cadastrarDespesa() é chamada, o método gravar é chamado dentro da função 
        através do objeto bd, o método gravar() se inicia com a variável id recebendo o retorno do método getProximoId(),
        onde a variável proximoId recebe recebe o valor da chave id, ou seja, 1, o método retorna a variável proximoId + 1, 
        totalizando 2, esse processo se repete a cada cadastro passando para 3, 4 e assim por diante.*/
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            /*A variável despesa recebe o elemento que tiver o valor da sua chave id igual a 1, se o elemento for == null,
            então o comando continue será responsável por interromper o fluxo da estrutura de repetição, senão
            o array despesas realizara a inserção do valor da variável despesa através do método push, após essa ação 
            ocorrerá o incremento da variável i, passando a ter seu valor igual a 2, isso sucetivamente 
            até todos os valores serem inseridos no array despesas. O valor recebido pela variável despesa 
            é encapsulado no método JSON.parse pois se trata de uma string, e a variável deve receber um objeto.*/
            let despesa = JSON.parse(localStorage.getItem(i))

            if (despesa == null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        /*A função filter é nativa de arrays em JS, sendo semelhante a função forEach que percorre cada um dos índices do array 
        recuperando o respectivo valor contido no índice, recebendo como parâmetro uma função de callback, a função de callback
        recebe um  parâmetro que representa cada elemento do array e faz o retorno de acordo com um teste lógico que retorna 
        true ou false.*/

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validarDados()) {
        //Inserção dos dados em LocalStorage
        bd.gravar(despesa)

        //Modal de sucesso
        $('#modalRegistroDespesa').modal('show')
        document.getElementById('modal-header').className = 'modal-header text-success'
        document.getElementById('titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('mensagem').innerHTML = 'A despesa foi cadastrada com sucesso!'
        document.getElementById('botao').innerHTML = 'Voltar'
        document.getElementById('botao').className = 'btn btn-success'

        //Reset dos campos para um nova digitação
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }
    else {
        //Modal de erro
        $('#modalRegistroDespesa').modal('show')
        document.getElementById('modal-header').className = 'modal-header text-danger'
        document.getElementById('titulo').innerHTML = 'Erro na gravação'
        document.getElementById('mensagem').innerHTML = 'Existem campos obrigatórios que não foram preenchidos.'
        document.getElementById('botao').innerHTML = 'Voltar e corrigir'
        document.getElementById('botao').className = 'btn btn-danger'
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //Recuperando a referência para o elemento tbody
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function (elemento) {
        //insertRow(): realiza a inserção de linhas no elemento tbody de acordo com a quantidade de elementos no array despesas.
        let linha = listaDespesas.insertRow()

        /*insertCell(): realiza a inserção de colunas. o método recebe um valor númerico como parâmetro
        partindo do valor 0 para a primeira coluna e assim por diante. 4 colunas foram inseridas no código abaixo.*/
        linha.insertCell(0).innerHTML = `${elemento.dia}/${elemento.mes}/${elemento.ano}`

        /*A comparação switch é feita por idêntico(===), o elemento.tipo é uma string por isso os números levam '' entre eles.
        uma outra solução seria realizar a conversão da referência de cada elemento do array despesas para um tipo númerico através
        do método pasreInt(elemento.tipo), com isso os números poderiam ser testados como valores númericos*/
        switch (elemento.tipo) {
            case '1': elemento.tipo = 'Alimentação'
                break
            case '2': elemento.tipo = 'Educação'
                break
            case '3': elemento.tipo = 'Lazer'
                break
            case '4': elemento.tipo = 'Sáude'
                break
            case '5': elemento.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = elemento.tipo
        linha.insertCell(2).innerHTML = elemento.descricao
        linha.insertCell(3).innerHTML = elemento.valor

        let botaoExcluir = document.createElement('button')
        botaoExcluir.className = 'btn btn-danger w-100'
        botaoExcluir.innerHTML = '<i class="fas fa-times"></i>'
        botaoExcluir.id = `id_despesa_${elemento.id}`

        botaoExcluir.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            //Método que atualiza a página 
            window.location.reload()
        }

        linha.insertCell(4).appendChild(botaoExcluir)
    })
}

//A função é chamada pelo botão pesquisar, através do evento onclick.
function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}