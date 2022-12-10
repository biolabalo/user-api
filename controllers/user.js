let users = [];

const idGenerator = () => {
  const maxId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;

  return maxId + 1;
};

class User {
  checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Basic ")) {
      let base64string = authHeader.split("Basic ")[1];
      let buffer = Buffer.from(base64string, "base64");
      let authString = buffer.toString("utf-8");

      if (authString === "test:pass1234") {
        return next();
      }

      return res.status(401).json({
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      message: "Invalid credentials",
    });
  };

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
        message: `User with id ${id} not found `,
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

    const newUser = {
      id: idGenerator(),
      ...req.body,
      date_created: new Date().toISOString(),
      date_updated: new Date().toISOString(),
    };

    users.push(newUser);

    return res.status(201).json({
      data: newUser,
    });
  };

  updateUser = (req, res) => {
    const id = +req.params.id;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res.status(404).json({
        message: `User with id ${id} not found `,
      });
    }

    const updatedUser = {
      ...user,
      ...req.body,
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
