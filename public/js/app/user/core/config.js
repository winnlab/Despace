define({
      router: {
        base: '/',
        modulesContainer: 'body',
        defaultRoute: {
            module: 'simplePage',
            id: 'main-page'
        },
        modules: [{
            name: 'simplePage',
            path: 'app/simplePage/simplePage',
            title: ''
        }, {
            name: 'projects',
            path: 'app/projects/projects',
            title: ''
        }]
    }
});