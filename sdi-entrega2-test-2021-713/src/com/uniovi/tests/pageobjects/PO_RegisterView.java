package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_RegisterView extends PO_NavView {

    /**
     * Rellena le formulario de registro
     * 
     * @param driver     apuntando al navegador abierto actualmente
     * @param emailp     email a escribir
     * @param nombrep    nombre a escribir
     * @param apellidosp apellidos a escribir
     * @param passwordp  contraseña a escribir
     * @param password2p contraseña de confirmación a escribir
     */
    static public void fillForm(WebDriver driver, String emailp, String nombrep,
            String apellidosp, String passwordp, String password2p) {
        WebElement email = driver.findElement(By.name("email"));
        email.click();
        email.clear();
        email.sendKeys(emailp);

        WebElement nombre = driver.findElement(By.name("nombre"));
        nombre.click();
        nombre.clear();
        nombre.sendKeys(nombrep);

        WebElement apellidos = driver.findElement(By.name("apellidos"));
        apellidos.click();
        apellidos.clear();
        apellidos.sendKeys(apellidosp);

        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);

        WebElement passwordConfirm = driver.findElement(By.name("password2"));
        passwordConfirm.click();
        passwordConfirm.clear();
        passwordConfirm.sendKeys(password2p);

        // Pulsar el boton de Alta.
        By boton = By.className("btn");
        driver.findElement(boton).click();
    }

    /**
     * Pulsa el botón de registro y rellena el formulario
     * 
     * @param driver   apuntando al navegador abierto actualmente
     * @param email email a escribir
     * @param name nombre a escribir
     * @param surname apellidos a escribir
     * @param pass contraseña a escribir
     * @param pass2 contraseña de confirmación a escribir
     */
    public static void signup(WebDriver driver, String email, String name,
            String surname, String pass, String pass2) {
        PO_NavView.clickOption(driver, "registrarse", "id", "registro-titulo");
        PO_RegisterView.fillForm(driver, email, name, surname, pass, pass2);
    }

}
