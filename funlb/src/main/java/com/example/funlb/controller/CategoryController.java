//package com.example.funlb.controller;
//
//import com.example.funlb.entity.Category;
//import com.example.funlb.service.CategoryService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RestController
//@RequestMapping("/api/categories")
//public class CategoryController {
//
//    @Autowired
//    private CategoryService categoryService;
//
//    @GetMapping
//    public List<Category> getAllCategories() {
//        return categoryService.getAllCategories();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Category> getCategoryById(@PathVariable UUID id) {
//        Category category = categoryService.getCategoryById(id);
//        if (category != null) {
//            return ResponseEntity.ok(category);
//        }
//        return ResponseEntity.notFound().build();
//    }
//
//    @PostMapping
//    public Category createCategory(@RequestBody Category category) {
//        return categoryService.createCategory(category);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
//        categoryService.deleteCategory(id);
//        return ResponseEntity.noContent().build();
//    }
//}