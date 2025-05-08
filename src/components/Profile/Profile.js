import './Profile'

export function Profile({imageCount}) {

    const Title = <h1 className="profile-user-name">Ariel & Yaara <br /> Wedding</h1>
    return(
        <header>

        <div class="container">
  
          <div class="profile">
  
            <div class="profile-image">
  
              <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt=""/>
  
            </div>
  
            <div class="profile-user-settings">
  
              {Title}
  
              <button class="btn profile-edit-btn">Edit Profile</button>
  
              <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog" aria-hidden="true"></i></button>
  
            </div>
  
            <div class="profile-stats">
  
              <ul>
                <li><span class="profile-stat-count">{imageCount}</span> posts</li>
                <li><span class="profile-stat-count">188</span> followers</li>
                <li><span class="profile-stat-count">206</span> following</li>
              </ul>
  
            </div>
  
            <div class="profile-bio">
  
              <p><span class="profile-real-name">Jane Doe</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>
  
            </div>
  
          </div>
  
        </div>
  
        </header>  
    );
}