<aside class="main-sidebar sidebar-dark-primary elevation-4">
  <a href="{{ $link['index'] }}" class="brand-link">
    <span class="brand-text font-weight-light content-center">PRAXXYS</span>
  </a>
  <div class="sidebar">
    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
      {{-- <div class="image">
        <img src="../../dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
      </div> --}}
      <div class="info">
        <a href="#" class="d-block">{{ strtoupper(Auth::user()->name); }}</a>
      </div>
    </div>
    <nav class="mt-2">
      <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <li class="nav-item">
          <a href="{{ $link['index'] }}" class="nav-link">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>
              Dashboard
            </p>
          </a>
        </li>
        <li class="nav-header">PRODUCT</li>
        <li class="nav-item">
          <a href="{{ $link['products'] }}" class="nav-link">
            <i class="nav-icon fas fa-list"></i>
            <p>
              List
            </p>
          </a>
        </li>
        <li class="nav-item">
          <a href="{{ $link['products-create'] }}" class="nav-link">
            <i class="nav-icon fa fa-pen-nib"></i>
            <p>
              Create
            </p>
          </a>
        </li>
        <li class="nav-header"><hr class="bg-gray p-0 m-0"></li>
        <li class="nav-item">
          <a href="{{ $link['video-player'] }}/1" class="nav-link">
            <i class="nav-icon fas fa-video"></i>
            <p>
              Video Player
            </p>
          </a>
        </li>
        <li class="nav-header"><hr class="bg-gray p-0 m-0"></li>
        <li class="nav-item">
          <a href="/logout" class="nav-link">
            <i class="nav-icon fas fa-door-open"></i>
            <p>
              Logout
            </p>
          </a>
        </li>
      </ul>
    </nav>
   
  </div>
</aside>


  