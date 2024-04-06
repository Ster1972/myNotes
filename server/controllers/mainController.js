const { Note } = require("../models/Note");
const mongoose = require("mongoose");
const passport = require("passport");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  const messages = await req.flash("info");

  const locals = {
    title: "Home Page",
    description: "Node Js Notes App",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const notes = await Note.aggregate([
      { $sort: { title: 1 } }, // Sort by title in ascending order, sort by descending use "-1"
      { $skip: perPage * page - perPage },
      { $limit: perPage }
    ]).exec();

    const count = await Note.countDocuments({});

    res.render("index", {
      locals,
      notes,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};


/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "Free NodeJs User Management System",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * New Note Form
 */
exports.addNote = async (req, res) => {
  const locals = {
    title: "Add New Note - NodeJs",
    description: "Free NodeJs User Management System",
  };

  res.render("note/add", locals);
};

/**
 * POST /
 * Create New Note
 */
exports.postNote = async (req, res) => {
  console.log(req.body);

  const newNote = new Note({
    title: req.body.Title,
    category: req.body.Category,
    linkurl: req.body.URL,
    comment: req.body.Comments,
  });

  try {
    await Note.create(newNote);
    await req.flash("info", "New note has been added.");

    res.redirect("/indexAuth");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Note Data
 */
exports.view = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });

    const locals = {
      title: "View Note Data",
      description: "Free NodeJs User Management System",
    };

    res.render("note/view", {
      locals,
      note,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Edit Note Data
 */
exports.edit = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Note Data",
      description: "Free NodeJs User Management System",
    };

    res.render("note/edit", {
      locals,
      note,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Update Note Data
 */
exports.editPost = async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, {
      title: req.body.Title,
      category: req.body.Category,
      linkurl: req.body.URL,
      comments: req.body.Comments,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete Note Data
 */
exports.deleteNote = async (req, res) => {
  
  try {
    await Note.deleteOne({ _id: req.params.id });
    res.redirect("/indexAuth");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search Note Data
 */
exports.searchNotes = async (req, res) => {
  const locals = {
    title: "Search Note Data",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const notes = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { category: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { linkurl: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { comment: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      notes,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};

//*******************************************
//  Section for pages that need authentication
//*****************************************


/**
 * Get /
 * SearchAuth Note Data
 */
exports.searchNotesAuth = async (req, res) => {
  const locals = {
    title: "SearchAuth Note Data",
    description: "Free NodeJs User Management System",
    headerType: 'headerAuth' 
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const notes = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { category: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { linkurl: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { comment: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("searchAuth", {
      notes,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  const messages = await req.flash("info");
  const locals = {
      title: 'Login Page',
      description: 'NodeJs DB app'
  }

  try {
    res.render("login", { locals, messages})

  } catch (error) {
    console.log(error);
  }
  
}

/**
 * POST /
 * Login
 */
exports.postlogin = function(req, res, next) {
  console.log('post login - ',req.body)
  passport.authenticate('local', function(err, user, info) {
    //console.log('post -----', user)
    if (err) { return next(err); }
    if (!user) {
      req.flash('info', 'Bad Email or password used'); // add this line to set the flash message
      return res.redirect('/login');
    }
    
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/indexAuth');
    });
  })(req, res, next);
};

/**
 * Get indexAuth
 */

exports.indexAuth = async (req, res) => {
  const messages = await req.flash("info");

  const locals = {
    title: "Home Page",
    description: "Node Js Notes App",
    headerType: 'headerAuth' 
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const notes = await Note.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Note.countDocuments({});

    res.render("indexAuth", {
      locals,
      notes,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};


