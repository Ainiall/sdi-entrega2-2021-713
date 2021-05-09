package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import com.uniovi.tests.util.SeleniumUtils;

public class PO_AdminView extends PO_NavView {

    /**
     * Selecciona un checkbox y elimina dicha fila
     * 
     * @param driver   apuntando al navegador abierto actualmente
     * @param checkbox checkbox seleccionado para borrar
     */
    public static void borrarCheckBox(WebDriver driver, String checkbox) {
        PO_View.checkElement(driver, "id", checkbox);
        driver.findElement(By.id(checkbox)).click();
        // se borra
        PO_View.checkElement(driver, "id", "btnDelete");
        driver.findElement(By.id("btnDelete")).click();

        SeleniumUtils.textoNoPresentePagina(driver, checkbox.substring(1));

    }

    /**
     * Comprueba que el usuario ya no forme parte de la base de datos
     * 
     * @param driver apuntando al navegador abierto actualmente
     * @param user
     */
    public static void checkUsuarioEliminado(WebDriver driver, String user) {
        PO_NavView.clickOption(driver, "desconectarse", "id",
                "identificacion-titulo");
        // intento de inicio fallido porque ya no existe el usuario
        PO_LoginView.loginIncorrecto(driver, user);

    }

}
