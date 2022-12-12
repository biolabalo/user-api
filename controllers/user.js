let users = [];
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const idGenerator = () => {
  const maxId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;

  return maxId + 1;
};

class User {
  getAllUsers = (req, res) => {
    let filteredUsers = users;

    let filter_field = req.query.filter_field;

    let filter_value = req.query.filter_value;

    if (filter_field && filter_value) {
      filteredUsers = filteredUsers.filter(
        (user) => user[filter_field] == filter_value
      );
    }
    let sort_field = req.query.sort_field;

    let sortedUsers = filteredUsers;

    if (sort_field) {
      sortedUsers.sort((a, b) => {
        const fieldA = a[sort_field].toLowerCase();
        const fieldB = b[sort_field].toLowerCase();

        if (fieldA < fieldB) return -1;

        if (fieldA > fieldB) return 1;

        return 0;
      });
    }

    return res.json({
      data: sortedUsers,
    });
  };

  getUser = (req, res) => {
    const id = +req.params.id;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({
        message: `User with id ${req.params.id} not found `,
      });
    }

    return res.json({
      data: user,
    });
  };

  createUser = (req, res) => {
    const { firstname, lastname, gender, date_of_birth } = req.body;

    // The client should ideally check for data correctness
    if (!firstname || !lastname || !gender || !date_of_birth) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (gender !== "M" && gender !== "F") {
      return res.status(400).json({
        message: "Gender can either be 'M' or 'F' ",
      });
    }

    if (!dateRegex.test(date_of_birth)) {
      return res.status(400).send({ error: "Invalid date format" });
    }

    if(req.body.id){
      delete req.body.id
    }

    const newUser = {
      id: idGenerator(),
      firstname, lastname, gender, date_of_birth,
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
    };

    users.push(newUser);

    return res.status(201).json({
      data: newUser,
    });
  };

  updateUser = (req, res) => {
    const { firstname, lastname, gender, date_of_birth } = req.body;

    const id = +req.params.id;
    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({
        message: `User with id ${req.params.id} not found `,
      });
    }

    if (gender !== "M" && gender !== "F") {
      return res.status(400).json({
        message: "Gender can either be 'M' or 'F' ",
      });
    }

    if (!dateRegex.test(date_of_birth)) {
      return res.status(400).send({ error: "Invalid date format" });
    }

    if(req.body.id){
      delete req.body.id
    }

    const updatedUser = {
      ...user,
      firstname, lastname, gender, date_of_birth,
      date_updated: new Date().toISOString(),
    };

    users = users.map((user) => (user.id === id ? updatedUser : user));

    return res.json({
      data: updatedUser,
    });
  };

  deleteUser = (req, res) => {
    const id = +req.params.id;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({
        message: `User with id ${id} not found `,
      });
    }

    users = users.filter((user) => user.id !== id);

    return res.end();
  };
}

module.exports = User;
