window.onload = function() {
  // Desabilitar o envio do formulário quando
  // se clica no botão Pesquisar

  // Recuperar o form do HTML
  // const = define uma constante
  // objeto document = representa o HTML (DOM) dentro do JS
  // getElementById = recupera um elemento (tag) pelo valor do id
  const form = document.getElementById('form_pesquisa');

  // a partir do form, usar o método addEventListener
  // definir uma função para tratar o evento submit do form
  const trataSubmit = function(evento) {
    evento.preventDefault();
    // console.log('Executando trataSubmit');
    // Recuperar valor digitado no input_todo
    const value = document.getElementById('input_todo').value;
  }
  form.addEventListener('submit', trataSubmit);

  // Recuperar o elemento btn_add
  // Add event listener de click para btn_add
  // Cria a função que adiciona um ToDo e exibe este na tabela
  //  - LocalStorage: funcionar como banco de dados
  const btnAdd = document.getElementById('btn_add');
  btnAdd.addEventListener('click', function(){
    //$('#modal_add').modal('toggle');
  });

  function limpaTabela() {
    const tbody = document.querySelector('#table_todos tbody');
    tbody.innerHTML = '';
  }

  function obterLocalStorage() {
    return JSON.parse(localStorage.getItem('todos'));
  }

  function addLocalStorage(todo) {
    const todos = obterLocalStorage() || [];
    console.log(todo);
    if(todo.id == -1) {
      todo.id = todos.at(-1).id+1;
      todos.push(todo);
    } else {
      for(let t of todos) {
        if(t.id == todo.id) {
          t.desc = todo.desc;
          t.dt_final = todo.dt_final;
        }
      }
    }
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function delLocalStorage(id) {
    const todos = obterLocalStorage() || [];
    if(todos.length == 0) {
      return;
    }

    for(let i in todos) {
      if(todos[i].id == id) {
        todos.splice(i, 1);
        break;
      }
    }

    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function buscarLocalStorage(id) {
    const todos = obterLocalStorage() || [];
    
    for(let t of todos) {
      if(t.id == id) {
        return t;
      }
    }

    return false;
  }

  function addComportamentoCkb(idTodo) {   
    const desc = document.getElementById(`desc_${idTodo}`);
    const dt_final = document.getElementById(`dt_${idTodo}`);

    if(!desc.style.textDecoration) {
      const lt = 'line-through';
      desc.style.textDecoration = lt;
      dt_final.style.textDecoration = lt;
    } else {
      desc.style.textDecoration = '';
      dt_final.style.textDecoration = '';
    }
  }

  function delTodoDaTabela(id) {
    const tr = document.getElementById(`tr_${id}`);
    tr.remove();
  }

  function tbodyClick(ev) {
    // ev.target = elemento que disparou o evento
    //  - Button: upadate (tipo: up) ou delete (tipo: del)
    //  - Checkbox (tipo: ckb)
    const elemento = ev.target;
    const [tipoEl, idTodo] = elemento.getAttribute('id').split('_');
    
    switch(tipoEl) {
      case 'ckb': 
        addComportamentoCkb(idTodo);
        break;
      case 'up':
        addComportamentoBtnUp(idTodo);
        break;
      case 'del':
        addComportamentoBtnDel(idTodo);
        break;
    }
  }

  function addComportamentoBtnUp(idTodo) {
    $('#modal_add').modal('toggle');
    const todo = buscarLocalStorage(idTodo);
    if(todo != false) {
      document.getElementById(`desc_todo`).value = todo.desc;
      const dt = todo.dt_final.split('/');
      document.getElementById(`dt_final_todo`).value = 
        dt[2] + '-' + dt[1] + '-' + dt[0];
      document.getElementById(`id_todo`).value = todo.id;
    }
  }

  function addComportamentoBtnDel(idTodo) {
    const del = confirm('Deseja realmente deletar ToDo?');
    if(del==true) {
      delLocalStorage(idTodo);
      delTodoDaTabela(idTodo);
    }
  }

  function addTodoNaTabela(todo) {
    const tbody = document.querySelector('#table_todos tbody');
    tbody.innerHTML += `
      <tr class="text-center" id="tr_${todo.id}">
        <td>
          <input type="checkbox" id="ckb_${todo.id}">
        </td>
        <td id="desc_${todo.id}">
          ${todo.desc}
        </td>
        <td id="dt_${todo.id}">
          ${todo.dt_final}
        </td>
        <td>
          <button class="btn btn-success" id="up_${todo.id}">Alterar</button>
          <button class="btn btn-danger" id="del_${todo.id}">Deletar</button>
        </td>
      </tr>
    `;

    tbody.addEventListener('click', tbodyClick);
  }

  const formAdd = document.getElementById('form_add');
  function salvarTodo(ev) {  
    ev.preventDefault();
    
    const desc = document.getElementById('desc_todo').value;
    let dt_final_ini = document.getElementById('dt_final_todo').value.split('-');
    const dt_final = dt_final_ini[2] + '/' + dt_final_ini[1] + '/' +  dt_final_ini[0];
    const id = document.getElementById('id_todo').value || -1;
    
    const todo = {
      desc,
      dt_final,
      id
    };

    addLocalStorage(todo);  
    ev.target.reset();
    $('#modal_add').modal('toggle');

    if(id == -1) {
      // Adicionando nova tarefa
      addTodoNaTabela(todo);
    } else {
      // Atualizar uma tarefa já existente
      document.getElementById(`desc_${id}`).innerHTML = desc;
      document.getElementById(`dt_${id}`).innerHTML = dt_final;
      document.getElementById(`id_todo`).removeAttribute('value');
    }
  }
  formAdd.addEventListener('submit', salvarTodo);

  function carregarTodos() {
    const todos = obterLocalStorage() || [];

    limpaTabela();
    for(let t of todos) {
      addTodoNaTabela(t);
    }
  }

  function limparForm() {
    document.getElementById('desc_todo').value = '';
    document.getElementById('dt_final_todo').value = '';
    document.getElementById('id_todo').removeAttribute('value');
  }

  carregarTodos();

  $('#modal_add').on('hidden.bs.modal', function (e) {
    limparForm();
  });

  const btnPes = document.getElementById('btn_pesquisar');
  btnPes.addEventListener('click', function(ev) {
    const descPesquisar = document.getElementById('input_todo').value;
    
    const todos = obterLocalStorage() || [];
    const todosSelecionados = [];
    for(let t of todos) {
      if(t.desc.toLowerCase().includes(descPesquisar.toLowerCase())) {
        todosSelecionados.push(t);
      }
    }
    addNaTabelaPorDesc(todosSelecionados);
  });

  function addNaTabelaPorDesc(todosSelecionados) {
    limpaTabela();
    for(let t of todosSelecionados) {
      addTodoNaTabela(t);
    }
  }
}

