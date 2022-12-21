window.addEventListener('load', function() {
  // Utils
  function DateUtils() {
    const dateUtils = {
      dateISOToLoc(date) {
        const dt = date.split('-');
        dt[2] = String(Number(dt[2])+1);
        return new Date(`${dt[0]}-${dt[1]}-${dt[2]}`).toLocaleDateString();    
      },
      dateLocToISO(date) {
        const dt = date.split('/');
        return `${dt[2]}-${dt[1]}-${dt[0]}`;
      }    
    };

    return dateUtils;
  }

  function LineThrough() {
    const lt = {
      addClassLineThrough(el) {
        el.classList.add('text-decoration-line-through');
      },
      remClassLineThrough(el) {
        el.classList.remove('text-decoration-line-through');
      }
    };

    return lt;
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
  function CreateTodo(desc, dt_final, id=undefined, status=0) {
    const { dateISOToLoc } = DateUtils();
    return {
      desc,
      dt_final: dateISOToLoc(dt_final),
      id,
      status
    };
  }

  // Repo ToDo
  function RepoTodo() {
    function parse(value) {
      return JSON.parse(value);
    }

    function stringify(value) {
      return JSON.stringify(value);
    }

    const repo = {
      getAllTodos() {
        const todoStr = localStorage.getItem('todos');
        return todoStr ? JSON.parse(todoStr) : [];
      },
      getTodoById(id) {
        const todos = repo.getAllTodos();
        for(let todo of todos) {
          if(todo.id == id) {
            return todo;
          }
        }
        return false;
      },
      addTodo(todo) {
        const todos = repo.getAllTodos();
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
        localStorage.setItem('todos', stringify(todos));
      },
      delTodo(id) {
        const todos = repo.getAllTodos();
        if(todos.length === 0) {
          return;
        }
        for(let i in todos) {
          if(todos[i].id == id) {
            todos.splice(i, 1);
            break;
          }
        }
        localStorage.setItem('todos', stringify(todos));
      },
      saveTodo(todo) {
        const todos = repo.getAllTodos();
        for(let i in todos) {
          if(todos[i].id == todo.id) {
            todos.splice(i, 1, todo);
            break;
          }
        }
        localStorage.setItem('todos', stringify(todos));
      },
      parse,
      stringify
    };

    return repo;
  }
  
  // Table
  function TodoTable() {
    const repo =  RepoTodo();

    const table = {
      clearTable() {
        const tbody = document.querySelector('#table_todos tbody');
        tbody.innerHTML = '';
      },
      remTodoOfTable(id) {
        const tr = document.getElementById(`tr_${id}`);
        tr.remove();
      },
      addListenerTable() {
        const tbody = document.querySelector('#table_todos tbody');
        tbody.addEventListener('click', clickTBody);
      },
      addTodoInTable(todo) {
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
      },
      addTodosInTable(todos) {
        table.clearTable();
        for(let todo of todos) {
          table.addTodoInTable(todo);
        }
        table.addListenerTable();
      },
      updateTodoInTable(todo) {
        const descEl = document.getElementById(`desc_${todo.id}`);
        const dtEl = document.getElementById(`dt_${todo.id}`);
        descEl.innerHTML = todo.desc;
        dtEl.innerHTML = todo.dt_final;
        const ckb = document.getElementById(`ckb_${todo.id}`);
        const { addClassLineThrough, remClassLineThrough } = LineThrough();
        if(todo.status == 1) {
          addClassLineThrough(descEl);
          addClassLineThrough(dtEl);
          ckb.setAttribute('checked', '');
        } else {  
          ckb.removeAttribute('checked');
          remClassLineThrough(descEl);
          remClassLineThrough(dtEl);
        }
      },
      loadTodosInTable() {
        const todos = repo.getAllTodos();
        table.clearTable();
        for(let t of todos) {
          table.addTodoInTable(t);
        }
        table.addListenerTable();
      }
    }

    return table;
  }

  // Listeners
  function Listener() {
    return {
      repo: RepoTodo()
    };
  }

  function ClickCkb() {   
    const { repo } = Listener();

    return {
      exec(idTodo) {
        const desc = document.getElementById(`desc_${idTodo}`);
        const dt_final = document.getElementById(`dt_${idTodo}`);

        todo = repo.getTodoById(idTodo);
        const { addClassLineThrough, remClassLineThrough } = LineThrough();
        if(!desc.classList.contains('text-decoration-line-through')) {
          addClassLineThrough(desc);
          addClassLineThrough(dt_final);
          todo.status = 1;
        } else {
          remClassLineThrough(desc);
          remClassLineThrough(dt_final);
          todo.status = 0;
        }

        repo.saveTodo(todo);
      }
    };
  }

  function ClickBtnUp() {
    const { repo } = Listener();
    const { fillForm } = ModalForm();

    return {
      exec(idTodo) {
        $('#modal_add').modal('toggle');
        const todo = repo.getTodoById(idTodo);
        if(todo != false) {
          fillForm(todo);
        }
      }
    };
  }

  function ClickBtnDel() {
    const { delTodo } = RepoTodo();
    const { remTodoOfTable } = TodoTable();

    return {
      exec(idTodo) {
        const del = confirm('Deseja realmente deletar ToDo?');
        if(del==true) {
          delTodo(idTodo);
          remTodoOfTable(idTodo);
          showAlertOk('ToDo removido com sucesso!');
        }
      }
    };
  }

  const clicks = {
    'checkout': ClickCkb(),
    'update': ClickBtnUp(),
    'delete': ClickBtnDel()
  };

  function clickTBody(ev) {
    const element = ev.target;
    
    const id = Number(element.getAttribute('data-index'));
    const dataTarget = element.getAttribute('data-target');
    
    clicks[dataTarget].exec(id);
  }

  // Form
  function ModalForm() {
    const form = {
      clearForm() {
        document.getElementById('desc_todo').value = '';
        document.getElementById('dt_final_todo').value = '';
        document.getElementById('id_todo').value = ''; 
      },
      fillForm(todo) {
        const { dateLocToISO } = DateUtils();
        document.getElementById('desc_todo').value = todo.desc;
        document.getElementById('dt_final_todo').value = dateLocToISO(todo.dt_final);
        document.getElementById('id_todo').value = todo.id; 
        const optionSel = String(todo.status);
        const statusEl = document.getElementById('status_todo');
        statusEl.selectedIndex = optionSel;
      }
    };

    return form;
  }

  // Default features
  function Main() {
    const repo = RepoTodo();
    const { clearForm } = ModalForm();
    const table = TodoTable();

    return {
      main() {
        const formSearch = document.getElementById('form_pesquisa');
        const inputSearch = document.getElementById('input_todo');
        formSearch.addEventListener('submit', function(ev) {
          ev.preventDefault();
          const value = inputSearch.value;
          const todos = getAllTodo();
          const todosSelecionados = [];
          for(let t of todos) {
            if(t.desc.toLowerCase().includes(value.toLowerCase())) {
              todosSelecionados.push(t);
            }
          }
          addTodosInTable(todosSelecionados);
        });

        function debounce(func, wait) {
          let timer = null;
          return function() {
            clearTimeout(timer);
            timer = setTimeout(func, wait);
          }
        }
        inputSearch.addEventListener('input', debounce(function() {
          const value = inputSearch.value;
          const todos = repo.getAllTodos();
          const todosSelecionados = [];
          for(let t of todos) {
            if(t.desc.toLowerCase().includes(value.toLowerCase())) {
              todosSelecionados.push(t);
            }
          }
          table.addTodosInTable(todosSelecionados);
        }, 1500))

        const formAdd = document.getElementById('form_add');
        formAdd.addEventListener('submit', function(ev) {  
          ev.preventDefault();
          
          const desc = document.getElementById('desc_todo').value;
          let dt_final = document.getElementById('dt_final_todo').value;
          const id = document.getElementById('id_todo').value || undefined;
          const statusEl = document.getElementById('status_todo');
          const status = Number(statusEl.options[statusEl.selectedIndex].value);
          
          const todo = CreateTodo(desc, dt_final, id, status);

          repo.addTodo(todo);  
          ev.target.reset();
          $('#modal_add').modal('toggle');

          if(id === undefined) {
            table.addTodoInTable(todo);
            table.addListenerTable();
            showAlertOk(`ToDo inserido com sucesso!`);
          } else {
            table.updateTodoInTable(todo);
            showAlertOk(`ToDo atualizado com sucesso!`);
          }
        });

        $('#modal_add').on('hidden.bs.modal', function (ev) {
          clearForm();
        });

        const table = TodoTable();
        table.loadTodosInTable();    
      }
    };
  }

  (function(){
    const main = Main();
    main.main();
  })();
});