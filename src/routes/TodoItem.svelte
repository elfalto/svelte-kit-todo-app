<!-- src/components/TodoItem.svelte -->
<script lang="ts">
    export let todo: any;
    export let onUpdate: (todo: any) => void;
    export let onDelete: (todo: any) => void;
</script>

<div class="todo-item">
    <input
        class="checkbox"
        type="checkbox"
        bind:checked={todo.isComplete}
        on:change={() => onUpdate(todo)}
    />
    <button class="delete_button" on:click={() => onDelete(todo)}>🗑</button>
    <li class:complete={todo.isComplete}>{todo.task}</li>
</div>

<style>
    .todo-item {
        display: flex;
        align-items: center;
    }
    .todo-item li {
        margin-left: 7px;
        list-style: none;
        font-family: Georgia, "Times New Roman", Times, serif;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        max-width: 300px;
    }
    .checkbox {
        width: 20px;
        height: 20px;
        accent-color: #000;
        cursor: pointer;
    }
    .delete_button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background: none;
        cursor: pointer;
    }
</style>