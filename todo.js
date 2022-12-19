window.addEventListener('load', function() {
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

  function addClassLineThrough(el) {
    el.classList.add('text-decoration-line-through');
  }

  function remClassLineThrough(el) {
    el.classList.remove('text-decoration-line-through');
  }

  // Alerts
  function showAlertOk(msg) {
    const alertOk = document.getElementById('alert_ok');
    alertOk.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <span>${msg}</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
    alertOk.classList.remove('cls_hidden');
  }

  // ToDo
  function createTodo(desc, dt_final, id=undefined, status=0) {
    return {
      desc,
      dt_final: dateISOToLoc(dt_final),
      id,
      status
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
          t.status = todo.status;
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
    
  function saveTodo(todo) {
    const todos = getAllTodo();
    for(let i in todos) {
      if(todos[i].id == todo.id) {
        todos.splice(i, 1, todo);
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
          <input 
            type="checkbox" 
            id="ckb_${todo.id}" 
            data-target="checkout" 
            data-index="${todo.id}"
            ${todo.status == 1 ? 'checked' : ''}
          >
        </td>
        <td 
          id="desc_${todo.id}"
          ${todo.status == 1 ? 'class="text-decoration-line-through"' : ''}
        >
          ${todo.desc}
        </td>
        <td 
          id="dt_${todo.id}"
          ${todo.status == 1 ? 'class="text-decoration-line-through"' : ''}
        >
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
  }

  function addTodosInTable(todos) {
    clearTable();
    for(let todo of todos) {
      addTodoInTable(todo);
    }
    addListenerTable();
  }

  function updateTodoInTable(todo) {
    const descEl = document.getElementById(`desc_${todo.id}`);
    const dtEl = document.getElementById(`dt_${todo.id}`);

    descEl.innerHTML = todo.desc;
    dtEl.innerHTML = todo.dt_final;

    if(todo.status == 1) {
      addClassLineThrough(descEl);
      addClassLineThrough(dtEl);
    } else {
      const ckb = document.getElementById(`ckb_${todo.id}`);
      ckb.removeAttribute('checked');
      remClassLineThrough(descEl);
      remClassLineThrough(dtEl);
    }
  }

  function loadTodos() {
    const todos = getAllTodo();

    clearTable();
    for(let t of todos) {
      addTodoInTable(t);
    }
    addListenerTable();
  }

  // Listeners
  function clickCkb(idTodo) {   
    const desc = document.getElementById(`desc_${idTodo}`);
    const dt_final = document.getElementById(`dt_${idTodo}`);

    todo = getTodoById(idTodo);
    if(!desc.classList.contains('text-decoration-line-through')) {
      addClassLineThrough(desc);
      addClassLineThrough(dt_final);
      todo.status = 1;
    } else {
      remClassLineThrough(desc);
      remClassLineThrough(dt_final);
      todo.status = 0;
    }

    saveTodo(todo);
  }

  function clickBtnUp(idTodo) {
    $('#modal_add').modal('toggle');
    const todo = getTodoById(idTodo);
    if(todo != false) {
      fillForm(todo);
    }
  }

  function clickBtnDel(idTodo) {
    const del = confirm('Deseja realmente deletar ToDo?');
    if(del==true) {
      delTodo(idTodo);
      remTodoInTable(idTodo);
      showAlertOk('ToDo removido com sucesso!');
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

  function fillForm(todo) {
    document.getElementById('desc_todo').value = todo.desc;
    document.getElementById('dt_final_todo').value = dateLocToISO(todo.dt_final);
    document.getElementById('id_todo').value = todo.id; 

    const optionSel = String(todo.status);
    const statusEl = document.getElementById('status_todo');
    statusEl.selectedIndex = optionSel;
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
    const statusEl = document.getElementById('status_todo');
    const status = Number(statusEl.options[statusEl.selectedIndex].value);
    
    const todo = createTodo(desc, dt_final, id, status);

    addTodo(todo);  
    ev.target.reset();
    $('#modal_add').modal('toggle');

    if(id === undefined) {
      addTodoInTable(todo);
      addListenerTable();
      showAlertOk(`ToDo inserido com sucesso!`);
    } else {
      updateTodoInTable(todo);
      showAlertOk(`ToDo atualizado com sucesso!`);
    }
  });

  $('#modal_add').on('hidden.bs.modal', function (ev) {
    clearForm();
  });

  loadTodos();
});