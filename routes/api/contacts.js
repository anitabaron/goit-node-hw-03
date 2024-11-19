// const Joi = require("joi");
const express = require("express");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../service/contactService");

// const schema = Joi.object({
//   name: Joi.string()
//     .pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)
//     .min(2)
//     .max(40)
//     .required(),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//       tlds: { allow: ["com", "net", "pl"] },
//     })
//     .required(),
//   phone: Joi.number().integer().required(),
// });

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const newContact = await addContact({ name, email, phone, favorite });
    res.status(201).json({
      message: "Contact created",
      contact: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    await removeContact(id);
    if (!id) {
      res.status(404).json({ message: "Id is required to delete contact" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const { name, email, phone, favorite } = req.body;
    const updatedContact = await updateContact(id, {
      name,
      email,
      phone,
      favorite,
    });
    res.status(201).json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const updatedContact = await updateContact(id, {
      favorite,
    });
    res.status(201).json({
      message: "Contact updated",
      contact: updatedContact,
    });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
