filter_dep = new Tracker.Dependency();

Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pageNotFound',
    yieldTemplates: {
        nav: {to: 'nav'},
        footer: {to: 'footer'},
        queue: {to: 'queue'}
    },
    onBeforeAction: filter_dep.depend()
});

Router.map(function() {

    function get_collection_sort(option, use_limit, limit){

        use_limit = typeof use_limit !== 'undefined' ? use_limit : true;

        var collection_opts = {};
        var collectionSort = {plays: -1};
        console.log(limit);
	var collectionLimit = 40;
        if(!isNaN(limit)){
            console.log('Updating collection limit to ' + limit);
            collectionLimit = limit;
        }
        else{
            // This is the default collection limit to load.
            // Further iterations will be reactivelly loaded.
            console.log('Using default collection limit of 40 tracks.');    
            collectionLimit = 40;
            //Session.set('collectionLimit', 40);
        }

        switch(option){
            case 'Most played':
            collectionSort = {plays: -1};
            break;
            case 'Least played':
            collectionSort = {plays: 1};
            break;
            case 'Added first':
            collectionSort = {createdAt: -1};
            break;
            case 'Added last':
            collectionSort = {createdAt: 1};
            break;
            default:
            collectionSort = {createdAt: -1};

        }

        collection_opts.sort = collectionSort;

        if(use_limit){
            collection_opts.limit = collectionLimit;
            console.log("New collection sort with limit object:");
            console.log(collection_opts);
        }

        return collection_opts;
    }

    function get_collection_filter(option){
        var collectionFilter = {};
        switch(option){
            case 'Tracks from everyone':
            collectionFilter = {};
            break;
            case 'Tracks added by me':
            collectionFilter = {userId: Meteor.userId()};
            break;
            default:
            collectionFilter = {};
        }

        return collectionFilter;
    }

    this.route('home', {
        path: '/',
    });

    // this.route('private', {
    //     path: '/masterList'
    // });

    // this.route('personalList', {
    //     path: '/personalList',
    //     template: 'filteredList',
    //     data: {
    //         hasMusic: function(){
    //             if(music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).count() > 0){
    //                 return true;
    //             }
    //             else return false;
    //         },
    //         musicCount: function(){
    //             return music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).count();
    //         },
    //         musicList: function(){
    //             return music.find({userId: Meteor.userId()}, {sort: {createdAt: -1}}).fetch();
    //         },
    //         playlistTitle: function(){
    //             return 'Personal Playlist';
    //         },
    //         playlistDescription: function(){
    //             return 'This is a playlist that contains only music that was added by you first on y2bt.';
    //         },
    //         playlistPicture: function(){
    //             return 'imgs/bg_personal.jpg';
    //         }
    //     }
        
    // });

    this.route('tracks', {
        path: '/tracks',
        template: 'filteredList',
        data: {
            hasMusic: function(){
                if(music.find(get_collection_filter(Session.get('trackFilter')), {sort: {plays: -1}}).count() > 0){
                    return true;
                }
                else return false;
            },
            musicCount: function(){
                return music.find(get_collection_filter(Session.get('trackFilter')), get_collection_sort(Session.get('trackOrder'), false)).count();
            },
            showLoadMore: function(){
                var visible_tracks = Session.get('collectionLimit');
                if(typeof(visible_tracks) == 'undefined'){
                    visible_tracks = 40;
                }
                var total_tracks = music.find(get_collection_filter(Session.get('trackFilter')), get_collection_sort(Session.get('trackOrder'), false)).count();
                console.log("Visible: " + visible_tracks);
                console.log("Total: " + total_tracks);
                if(visible_tracks < total_tracks) return true;
                return false;
            },
            musicList: function(){
                return music.find(get_collection_filter(Session.get('trackFilter')), get_collection_sort(Session.get('trackOrder'), true, Session.get('collectionLimit'))).fetch();
            },
            playlistTitle: function(){
                return 'Tracks';
            },
            playlistDescription: function(){
                return 'Filter and listen tracks added to the group. You can queue, download and add tracks to playlists.';
            },
            playlistPicture: function(){
                return 'imgs/bg_personal.jpg';
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
            return {_id: this.params._id};
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

Router.rerun = filter_dep.changed();
