package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_ChatView extends PO_NavView {

    /**
     * Rellena el formulario de nuevo mensaje para el chat
     * 
     * @param driver   apuntando al navegador abierto actualmente
     * @param mensajep mensaje a escribir
     */
    static public void fillForm(WebDriver driver, String mensajep) {
        WebElement mensaje = driver.findElement(By.name("agregar-mensaje"));
        mensaje.click();
        mensaje.clear();
        mensaje.sendKeys(mensajep);

        driver.findElement(By.id("boton-agregar")).click();
    }

    /**
     * Selecciona y dirige al chat de la primera oferta
     * 
     * @param driver apuntando al navegador abierto actualmente
     */
    public static void primerChat(WebDriver driver) {
        // pulsamos el primer chat
        PO_View.checkElement(driver, "text", "Google Home");
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[1]/td[5]/a"))
                .click();
    }
}
