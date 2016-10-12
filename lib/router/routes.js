Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pageNotFound',
    yieldTemplates: {
        nav: {to: 'nav'},
        footer: {to: 'footer'},
        queue: {to: 'queue'}
    }
});

Router.map(function() {
    this.route('home', {
        path: '/',
    });

    this.route('private', {
        path: '/masterList'
    });

    this.route('personalList', {
        path: '/personalList',
        template: 'filteredList',
        data: {
            hasMusic: function(){
                if(music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).count() > 0){
                    return true;
                }
                else return false;
            },
            musicCount: function(){
                return music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).count();
            },
            musicList: function(){
                return music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).fetch();
            },
            playlistTitle: function(){
                return 'Personal Playlist';
            },
            playlistDescription: function(){
                return 'This is a playlist that contains only music that was added by you first on y2bt.';
            },
            playlistPicture: function(){
                return 'imgs/bg_personal.jpg';
            }
        }
        
    });

    this.route('topList', {
        path: '/topList',
        template: 'filteredList',
        data: {
            hasMusic: function(){
                if(music.find({}, {sort: {plays: -1}}).count() > 0){
                    return true;
                }
                else return false;
            },
            musicCount: function(){
                return music.find({}, {sort: {plays: -1}}).count();
            },
            musicList: function(){
                return music.find({}, {sort: {plays: -1}}).fetch();
            },
            playlistTitle: function(){
                return 'Top Chart Playlist';
            },
            playlistDescription: function(){
                return 'This playlist contains all the y2bt tracks ordered by number of plays.';
            },
            playlistPicture: function(){
                return 'imgs/bg_top.jpg';
            }
        }
        
    });

    this.route('playlists', {
        path: '/playlists',
        template: 'playlists'
    });

    this.route('playlist', {
        path: '/playlist/:_id',
        template: 'playlist',
        data: function(){
            return {_id: this.params._id}
        }
    });


    this.route('add');
    this.route('search');
    
});

Router.plugin('ensureSignedIn', {
  only: ['home', 'private', 'personalList', 'topList', 'playlist', 'playlists', 'add', 'search']
});

//Routes
AccountsTemplates.configureRoute('changePwd');
//AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
//AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
