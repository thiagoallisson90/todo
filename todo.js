window.addEventListener('load', () => {
  // Repo ToDo
  function getAllTodo() {
    const todoStr = localStorage.getItem('todos');
    return todoStr ? JSON.parse(todoStr) : [];
  }

  function getTodoById(id) {
    const todos = getAllTodo();
    
    for(let todo of todos) {
      if(todo.id == id) {
        return todo;
      }
    }

    return false;
  }

  function addTodo(todo) {
    const todos = getAllTodo();
    if(todo.id === undefined) {
      const lastTodo = todos.at(-1);
      todo.id = lastTodo ? lastTodo.id+1 : 0;
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

  function delTodo(id) {
    const todos = getAllTodo();
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
  
  // Table
  function clearTable() {
    const tbody = document.querySelector('#table_todos tbody');
    tbody.innerHTML = '';
  }

  function remTodoInTable(id) {
    const tr = document.getElementById(`tr_${id}`);
    tr.remove();
  }

  function addTodoInTable(todo) {
    const tbody = document.querySelector('#table_todos tbody');
    tbody.innerHTML += `
      <tr class="text-center" id="tr_${todo.id}">
        <td>
          <input type="checkbox" id="ckb_${todo.id}" data-target="checkout" data-index="${todo.id}">
        </td>
        <td id="desc_${todo.id}">
          ${todo.desc}
        </td>
        <td id="dt_${todo.id}">
          ${todo.dt_final}
        </td>
        <td>
          <button 
            class="btn btn-success" 
            id="up_${todo.id}"
            data-target="update" 
            data-index="${todo.id}"
          >
            Alterar
          </button>
          <button 
            class="btn btn-danger" 
            id="del_${todo.id}"
            data-target="delete" 
            data-index="${todo.id}"
          >
            Deletar
          </button>
        </td>
      </tr>
    `;

    tbody.addEventListener('click', clickTBody);
  }

  function loadTodos() {
    const todos = getAllTodo();

    clearTable();
    for(let t of todos) {
      addTodoInTable(t);
    }
  }

  // Listeners
  function clickCkb(idTodo) {   
    const desc = document.getElementById(`desc_${idTodo}`);
    const dt_final = document.getElementById(`dt_${idTodo}`);

    if(!desc.style.textDecoration) {
      const lt = 'line-through';
      desc.style.textDecoration = lt;
      dt_final.style.textDecoration = lt;
    } else {
      desc.style.removeProperty('text-decoration');
      dt_final.style.removeProperty('text-decoration');
    }
  }

  function clickBtnUp(idTodo) {
    $('#modal_add').modal('toggle');
    const todo = getTodoById(idTodo);
    if(todo != false) {
      document.getElementById(`desc_todo`).value = todo.desc;
      const dt = todo.dt_final.split('/');
      document.getElementById(`dt_final_todo`).value = 
        dt[2] + '-' + dt[1] + '-' + dt[0];
      document.getElementById(`id_todo`).value = todo.id;
    }
  }

  function clickBtnDel(idTodo) {
    const del = confirm('Deseja realmente deletar ToDo?');
    if(del==true) {
      delTodo(idTodo);
      remTodoInTable(idTodo);
    }
  }

  const clicks = {
    'checkout': clickCkb,
    'update': clickBtnUp,
    'delete': clickBtnDel
  };

  function clickTBody(ev) {
    const element = ev.target;
    
    const id = Number(element.getAttribute('data-index'));
    const dataTarget = element.getAttribute('data-target');
    
    clicks[dataTarget](id);
  }

  // Form
  function clearForm() {
    document.getElementById('desc_todo').value = '';
    document.getElementById('dt_final_todo').value = '';
    document.getElementById('id_todo').value = ''; 
  }

  // Default features
  const form = document.getElementById('form_pesquisa');
  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const descPesquisar = document.getElementById('input_todo').value;
    const todos = getAllTodo();
    const todosSelecionados = [];
    for(let t of todos) {
      if(t.desc.toLowerCase().includes(descPesquisar.toLowerCase())) {
        todosSelecionados.push(t);
      }
    }
    clearTable();
    for(let t of todosSelecionados) {
      addTodoInTable(t);
    }
  });

  const formAdd = document.getElementById('form_add');
  function salvarTodo(ev) {  
    ev.preventDefault();
    
    const desc = document.getElementById('desc_todo').value;
    let dt_final_ini = document.getElementById('dt_final_todo').value.split('-');
    const dt_final = dt_final_ini[2] + '/' + dt_final_ini[1] + '/' +  dt_final_ini[0];
    const id = document.getElementById('id_todo').value || undefined;
    
    const todo = {
      desc,
      dt_final,
      id
    };

    addTodo(todo);  
    ev.target.reset();
    $('#modal_add').modal('toggle');

    if(id == undefined) {
      addTodoInTable(todo);
    } else {
      document.getElementById(`desc_${id}`).innerHTML = desc;
      document.getElementById(`dt_${id}`).innerHTML = dt_final;
      document.getElementById(`id_todo`).removeAttribute('value');
    }
  }
  formAdd.addEventListener('submit', salvarTodo);

  loadTodos();

  $('#modal_add').on('hidden.bs.modal', function (ev) {
    clearForm();
  });
});