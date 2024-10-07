<!-- src/components/TodoList.svelte -->
<script lang="ts">
    import TodoItem from "./TodoItem.svelte";
    export let todos: any[];
    export let onUpdate: (todo: any) => void;
    export let onDelete: (todo: any) => void;
</script>

<div class="list-container">
    <ol style="padding: 0%;">
        {#each todos as todo}
            <TodoItem {todo} {onUpdate} {onDelete} />
        {:else}
            <p>Add your first todo</p>
        {/each}
    </ol>
</div>

<style>
    .list-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 200px;
    }
</style>