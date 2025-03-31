package com.example.learn2play.Controllers;

import com.example.learn2play.Models.User;
import com.example.learn2play.Respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserRepository repository;


    @GetMapping("/persons")
    public List<User> allPersons(){
        return repository.findAll();
    }

    @GetMapping("/person/{name}")
    public List<User> findByName(@PathVariable("name") String name) {
        return repository.findByName(name);
    }

    @PostMapping("/person")
    public User createPerson(@RequestBody User user) {
        return repository.save(user);
    }

    @PutMapping("/person/{id}")
    public User updatePerson(@PathVariable int id ,@RequestBody User user) {
        return repository.save(user);
    }

    @DeleteMapping("/person/{id}")
    public void deletePerson(@PathVariable("id") Long id) {
        repository.deleteById(id);
    }
}
