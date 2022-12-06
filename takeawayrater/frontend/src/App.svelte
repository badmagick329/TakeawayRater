<script>
  import { Route, Router } from "svelte-routing";
  import Home from "./comps/Home.svelte";
  import SearchUsers from "./comps/social/SearchUsers.svelte";
  import Social from "./comps/social/Social.svelte";
</script>

<main class="main">
  <Router>
    <nav>
      <a class="nav-link" href="/">Orders</a>
      <a class="nav-link" href="/links-list">Linked Accounts</a>
      <a class="nav-link" href="/search-users">Search Users</a>
      <a class="nav-link" href="/logout">Log Out</a>
    </nav>
    <div class="content">
      <Route path="/" component={Home} />
      <Route path="/links-list" component={Social} />
      <Route path="/search-users" component={SearchUsers} />
    </div>
  </Router>
</main>

<style lang="scss">
  $bg-color: #774a62;
  $order-bg-color: #fbd2c9;
  $tags-bg-color: #4b4b4b;
  $border-color-dark: black;
  $border-color-light: white;
  $text-color-dark: black;
  $text-color-light: white;
  $nav-bg-color: black;
  $nav-link-color: #979797;
  $nav-link-hover-color: white;

  :global(.main) {
    background-color: $bg-color;
    & :global(.order) {
      background-color: $order-bg-color;
      display: flex;
      flex-direction: column;
      color: $text-color-dark;
      border: 1px solid $border-color-dark;
      border-radius: 4px;
      margin: 5px 0;
      width: 100%;
    }
    & :global(.tags span) {
      background-color: $tags-bg-color;
    }
    & :global(h4) {
      font-size: 1.2em;
      margin-top: 0.4em;
    }
    & :global(.text-color-1) {
      color: $text-color-dark;
    }

    & :global(.text-color-2) {
      color: $text-color-light;
    }
    & :global(.loading) {
      display: flex;
      justify-content: center;
    }
    & :global(.loading__spinner) {
      display: inline-block;
      width: 80px;
      height: 80px;
    }
    & :global(.loading__spinner:after) {
      content: " ";
      display: block;
      width: 64px;
      height: 64px;
      margin: 8px;
      border-radius: 50%;
      border: 6px solid $text-color-light;
      border-color: $text-color-light transparent $text-color-light transparent;
      animation: loading__spinner 1.2s linear infinite;
    }
    @keyframes loading__spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    width: 100%;
    nav {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: fixed;
      background-color: $nav-bg-color;
      padding: 0.5rem 0;
      width: 100%;
      height: 3vh;
      z-index: 1;
      .nav-link {
        color: $nav-link-color;
        margin: 0 1.5rem;
      }
      .nav-link:hover {
        color: $nav-link-hover-color;
        text-decoration: none;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 5vh;
      width: 100%;
    }
  }
</style>
