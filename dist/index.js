"use strict";
let arrayProdutos = [];
function adicionarProduto() {
    let nomeInput = document.getElementById("nome");
    let codigoInput = document.getElementById("codigo");
    let quantidadeInput = document.getElementById("quantidade");
    let precoInput = document.getElementById("preco");
    let nome = nomeInput.value.trim();
    let codigo = Number(codigoInput.value.trim());
    let quantidade = Number(quantidadeInput.value.trim());
    let preco = parseFloat(precoInput.value.trim());
    if (!nome || !codigo || !quantidade || !preco) {
        alert("Preencha todos os campos!");
        return;
    }
    let tabela = document.getElementById("tabela-produtos");
    let linha = document.createElement("tr");
    arrayProdutos.push({
        nome,
        codigo,
        quantidade,
        preco,
    });
    localStorage.setItem("produtos", JSON.stringify(arrayProdutos)); // Guarda os valores na memória do navegador
    linha.innerHTML = `
        <td>${nome}</td>
        <td>${codigo}</td>
        <td>${quantidade}</td>
        <td>R$:${preco.toFixed(2)}</td>
        <td class="acoes">
            <button onclick= "editarProduto(this)"> Editar </button>
            <button class="remover" onclick="removerProduto(this)"> Remover </button>
        </td>
    `;
    if (tabela) {
        tabela.appendChild(linha);
    }
    else {
        console.log("Elemento tabela não encontrado!");
    }
    // Limpar os campos após adicionar
    nomeInput.value = '';
    quantidadeInput.value = '';
    codigoInput.value = '';
    precoInput.value = '';
}
function carregarProdutosSalvos() {
    let dados = localStorage.getItem("produtos");
    if (dados) {
        arrayProdutos = JSON.parse(dados);
        const tabela = document.getElementById("tabela-produtos");
        tabela.innerHTML = ''; // limpa a tabela
        for (let produto of arrayProdutos) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$:${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
        }
    }
}
function removerProduto(botao) {
    var _a;
    let linha = (_a = botao.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    const codigo = Number(linha.cells[1].textContent);
    // Remover do array.
    for (let i = 0; i < arrayProdutos.length; i++) {
        if (arrayProdutos[i].codigo === codigo) {
            arrayProdutos.splice(i, 1); // remove 1 item no índice i
            break;
        }
    }
    linha.remove();
    localStorage.setItem("produtos", JSON.stringify(arrayProdutos));
}
let codigoEmEdicao = null;
function editarProduto(botao) {
    var _a;
    let linha = (_a = botao.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    const nome = linha.cells[0].textContent || '';
    const codigo = Number(linha.cells[1].textContent);
    const quantidade = Number(linha.cells[2].textContent);
    const precoTexto = linha.cells[3].textContent || '';
    const preco = Number(precoTexto.replace('R$:', '').trim());
    // Preenche os campos
    document.getElementById("nome").value = nome;
    document.getElementById("codigo").value = codigo.toString();
    document.getElementById("quantidade").value = quantidade.toString();
    document.getElementById("preco").value = preco.toString();
    // Salva o código em edição
    codigoEmEdicao = codigo;
    // Troca o botão "Adicionar Produto" por "Salvar Edição"
    const botaoAdicionar = document.querySelector("button[onclick='adicionarProduto()']");
    botaoAdicionar.textContent = "Salvar Edição";
    botaoAdicionar.setAttribute("onclick", "salvarEdicao()");
}
function salvarEdicao() {
    let nomeInput = document.getElementById("nome");
    let codigoInput = document.getElementById("codigo");
    let quantidadeInput = document.getElementById("quantidade");
    let precoInput = document.getElementById("preco");
    let nome = nomeInput.value.trim();
    let codigo = Number(codigoInput.value.trim());
    let quantidade = Number(quantidadeInput.value.trim());
    let preco = parseFloat(precoInput.value.trim());
    // 3. Validar os dados (mesma validação da função adicionarProduto)
    if (!nome || !codigo || !quantidade || !preco) {
        alert("Preencha todos os campos!");
        return;
    }
    // 4. Verificar se temos um código para edição (garantir que estamos editando um produto válido)
    if (codigoEmEdicao === null) {
        alert("Nenhum produto selecionado para edição.");
        return;
    }
    // 5. Encontrar o índice do produto que está sendo editado no array
    let indiceProduto = arrayProdutos.findIndex(produto => produto.codigo === codigoEmEdicao);
    if (indiceProduto === -1) {
        alert("Produto não encontrado no catálogo.");
        return;
    }
    // 6. Atualizar os dados do produto no array
    arrayProdutos[indiceProduto] = {
        nome,
        codigo,
        quantidade,
        preco
    };
    // 7. Salvar no localStorage
    localStorage.setItem("produtos", JSON.stringify(arrayProdutos));
    // 8. Atualizar a tabela inteira para refletir as mudanças
    carregarProdutosSalvos();
    // 9. Resetar o botão para "Adicionar Produto" e sua função original
    const botaoAdicionar = document.querySelector("button[onclick='salvarEdicao()']");
    botaoAdicionar.textContent = "Adicionar Produto";
    botaoAdicionar.setAttribute("onclick", "adicionarProduto()");
    nomeInput.value = '';
    codigoInput.value = '';
    quantidadeInput.value = '';
    precoInput.value = '';
    // 11. Limpar a variável que indica edição
    codigoEmEdicao = null;
}
function buscarProdutos() {
    let nomeInput = document.getElementById("nome");
    let codigoInput = document.getElementById("codigo");
    let quantidadeInput = document.getElementById("quantidade");
    let nome = nomeInput.value.trim();
    let codigo = codigoInput.value.trim();
    let quantidade = quantidadeInput.value.trim();
    let tabela = document.getElementById("tabela-produtos");
    tabela.innerHTML = '';
    for (let produto of arrayProdutos) {
        let nomeEncontrado = nome !== '' && produto.nome.toLowerCase() === nome.toLowerCase();
        let codigoEncontrado = codigo !== '' && produto.codigo === Number(codigo);
        let quantidadeEncontrada = quantidade !== "" && produto.quantidade === Number(quantidade);
        if (nomeEncontrado || codigoEncontrado || quantidadeEncontrada) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$:${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
            return;
        }
        if (nome === '' && codigo === '' && quantidade === '') {
            for (let produto of arrayProdutos) {
                let linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.codigo}</td>
                    <td>${produto.quantidade}</td>
                    <td>R$:${produto.preco.toFixed(2)}</td>
                    <td class="acoes">
                        <button onclick="editarProduto(this)">Editar</button>
                        <button class="remover" onclick="removerProduto(this)">Remover</button>
                    </td>
                `;
                tabela.appendChild(linha);
            }
            return;
        }
    }
    tabela.innerHTML = `<tr><td colspan="5">Produto não encontrado.</td></tr>`;
}
window.onload = carregarProdutosSalvos; // Quando atualizar janela será carregado os produtos registrados
