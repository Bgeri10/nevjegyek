var express = require('express');
var passport = require('passport');
var router = new express.Router;

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.flash('error', 'A kért tartalom megtekintéséhez be kell jelentekzni!');
    res.redirect('/login/login');
}

function andRestrictTo(role) {
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        } else {
            res.status(403).send('mennyinnen');
        }
    }
}

router.route('/login/login')
    .get(function (req, res) {
        res.render('login/index', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/list',
        failureRedirect: '/login/login',
        failureFlash: true,
        badRequestMessage: 'Hibás felhasználó vagy jelszó!'
    }));
    
router.route('/login/signup')
    .get(function (req, res) {
        res.render('login/signup', {
            uzenetek: req.flash()
        });
    })
    .post(passport.authenticate('local-signup', {
        successRedirect:    '/login/login',
        failureRedirect:    '/login/signup',
        failureFlash:       true,
        badRequestMessage:  'Hiányzó adatok'
    }));

router.use('/login/logout', function (req, res) {
    req.logout();
    res.redirect('/login/login');
});

router.route('/')
    .get(function (req, res) {
        res.render('info');
    });
router.route('/add')
    .get(ensureAuthenticated, function (req, res) { 
        res.render('add', {
            uzenetek: req.flash()
        }); 
    })
    .post(ensureAuthenticated, function (req, res) {
        req.checkBody('nev').notEmpty().withMessage('Kihagytad a nevet!');
        req.checkBody('foglalkozas').notEmpty().withMessage('Kihagytad a foglalkozást!');
        req.checkBody('telefonszam').notEmpty().withMessage('Kihagytad a telefonszámot!');
        if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            res.redirect('/add');
        } else {
            req.app.models.nevjegy.create({
                nev: req.body.nev,
                foglalkozas: req.body.foglalkozas,
                telefonszam: req.body.telefonszam,
            })
            .then(function () {
                req.flash('success', 'Névjegy sikeresen létrehozva.');
                res.redirect('/add'); 
            });
        }
    });
router.route('/list')
    .get(ensureAuthenticated, function (req, res) {
        var result;
        
        if (req.query.kereses) {
            result = req.app.models.nevjegy.find({
                nev: { 'contains': req.query.kereses }
            });
        } else {
            result = req.app.models.nevjegy.find();
        }
        
        result.then(function (nevjegyek) {
            res.render('list', {
                uzenetek: req.flash(),
                nevjegyek: nevjegyek
            });
        });
    });
router.route('/delete/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.nevjegy.destroy({
            id: req.params.id
        }).then(function () {
            req.flash('success', 'Névjegy törölve.');
            res.redirect('/list');  
        });
    });
router.route('/ready/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.nevjegy.update({
            id: req.params.id
        }, {
            kesz: true
        }).then(function () {
            res.redirect('/list');  
        });
    });
router.route('/nevjegy/:id')
    .get(ensureAuthenticated, function (req, res) {
        req.app.models.nevjegy.findOne({
            id: req.params.id
        }).then(function (nevjegy) {
            res.render('nevjegy', {
                uzenetek: req.flash(),
                nevjegy: nevjegy
            })
        });
    })
    .post(ensureAuthenticated, function (req, res) {
        req.checkBody('nev').notEmpty().withMessage('Kihagytad a nevet!');
        req.checkBody('foglalkozas').notEmpty().withMessage('Kihagytad a foglalkozást!');
        req.checkBody('telefonszam').notEmpty().withMessage('Kihagytad a telefonszámot!');
        if (req.validationErrors()) {
            req.validationErrors().forEach(function (error) {
                req.flash('error', error.msg);
            });
            res.redirect('/nevjegy/'+req.params.id);
        } else {
            req.app.models.nevjegy.create({
                nev: req.body.nev,
                foglalkozas: req.body.foglalkozas,
                telefonszam: req.body.telefonszam,
            })
            .then(function () {
                req.app.models.nevjegy.destroy({
                    id: req.params.id
                }).then(function () {
                    req.flash('success', 'Névjegy sikeresen módosítva.');
                    res.redirect('/list'); 
                });
            })
        }
    });
module.exports = router;