package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_AddOfferView extends PO_NavView {

    /**
     * Rellena el formulario de datos de una nueva oferta
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param titulop título a escribir
     * @param descripcionp descripción a escribir
     * @param preciop precio a escribir
     */
    static public void fillForm(WebDriver driver, String titulop,
            String descripcionp, String preciop) {

        WebElement titulo = driver.findElement(By.name("titulo"));
        titulo.click();
        titulo.clear();
        titulo.sendKeys(titulop);

        WebElement descripcion = driver.findElement(By.name("descripcion"));
        descripcion.click();
        descripcion.clear();
        descripcion.sendKeys(descripcionp);

        WebElement precio = driver.findElement(By.name("precio"));
        precio.click();
        precio.clear();
        precio.sendKeys(preciop);

        By boton = By.className("btn");
        driver.findElement(boton).click();
    }

}
