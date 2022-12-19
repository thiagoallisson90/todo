window.addEventListener('load', () => {
  // Utils
  function dateISOToLoc(date) {
    const dt = date.split('-');
    dt[2] = String(Number(dt[2])+1);
    return new Date(`${dt[0]}-${dt[1]}-${dt[2]}`).toLocaleDateString();
  }

  function dateLocToISO(date) {
    const dt = date.split('/');
    return `${dt[2]}-${dt[1]}-${dt[0]}`;
  }

  // ToDo
  function createTodo(desc, dt_final, id=undefined) {
    return {
      desc,
      dt_final: dateISOToLoc(dt_final),
      id
    };
  }

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

  function addListenerTable() {
    const tbody = document.querySelector('#table_todos tbody');
    tbody.addEventListener('click', clickTBody);
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

    addListenerTable();
  }

  function addTodosInTable(todos) {
    clearTable();
    for(let todo of todos) {
      addTodoInTable(todo);
    }
  }

  function updateTodoInTable(todo) {
    document.getElementById(`desc_${todo.id}`).innerHTML = todo.desc;
    document.getElementById(`dt_${todo.id}`).innerHTML = todo.dt_final;
    addListenerTable();
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
      fillForm(todo.desc, todo.dt_final, todo.id);
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

  function fillForm(desc, dt_final, id) {
    document.getElementById('desc_todo').value = desc;
    document.getElementById('dt_final_todo').value = dateLocToISO(dt_final);
    document.getElementById('id_todo').value = id; 
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
    addTodosInTable(todosSelecionados);
  });

  const formAdd = document.getElementById('form_add');
  formAdd.addEventListener('submit', function(ev) {  
    ev.preventDefault();
    
    const desc = document.getElementById('desc_todo').value;
    let dt_final = document.getElementById('dt_final_todo').value;
    const id = document.getElementById('id_todo').value || undefined;
    
    const todo = createTodo(desc, dt_final, id);

    addTodo(todo);  
    ev.target.reset();
    $('#modal_add').modal('toggle');

    if(id === undefined) {
      addTodoInTable(todo);
    } else {
      updateTodoInTable(todo);
    }
  });

  $('#modal_add').on('hidden.bs.modal', function (ev) {
    clearForm();
  });

  loadTodos();
});