## Logboek

# 3 juni
Introductie dag. Begonnen met het maken van een ontwerp. Voor het ontwerp heb ik gekozen voor een circular chart,
een grouped barchart en een pie chard. Er is gekozen voor een circular chart chart omdat je daar goed de verhoudingen tussen provincie en niveau (havo, vmbo-t, etz.) kan weergeven.

# 4 juni
Design document gemaakt. Door de introductie dag voor het afstuderen van de Hva heb ik deze dag niet veel aan het project gezeten.

# 5 juni
De pie chart veranderd in een stacked piechart. 1 van de 2 pie's word het gemiddelde persentage. Hierdoor is goed het verschil af te lezen tussen het gemiddelde en de aangeklikte waarde. Line toegevoegd bij de groeped barchart. De lijn bevat de gemiddelde waardes.

# 6 juni
Line van grouped barchart veranderd in een extra bar naast de bestaande bars. Een lijn gaf een vertekend beeld. Alsof er verandering plaats vond. Maar het zijn waardes per niveau. Voor het versnellen van de pagina word het parsen van de data in apparte python bestanden gedaan. Tevens verkort dit de code.

# 7 juni
Door de kleine variaties in de veranderingen van de piechart is er een hover functie aangemaakt met de persentages erbij. Zo kunnen ook de minimale verschillen vergeleken worden.

# 10 juni
Voor verduidelijking van de bubble chart. Zijn er kleuren per niveau toegevoegd (per provinsie 6 kleuren).

# 11 juni
Doordat er naar de gemiddelde gegevens gekeken word zijn er vaak niet erg grote verschillen te zijn. Wanneer de scholen aan de circular chart toegevoegd worden word deze erg onduidelijk en traag. Hierdoor is er gekozen om een knop te maken waarme de circular chart geswitched kan worden naar een bubble chart (van alle scholen). door op de bubbels te klikken zullen ook hierdoor de andere grafieken zich aanpassen.

# 12 juni
Om de scholen/ niveau's beter met elkaar te kunnen vergelijken is er bij de barchart voor gekozen om een statische y as te houden. Zo kan er je goed zien wanneer de gemiddelde cijfers per stroming toe of af nemen. Ook is de code opgesplitst in meerdere bestanden. 1 groot javascript bestand is niet overzichtelijk. Er is een init bestand aangemaakt waar alle data word ingeladen. Ook is er per graph een appart javascript bestand aangemaakt.

# 13 juni
In de bubble chart per province de scholen een bepaalde kleur gegeven. Hierbij een sorteer knop aangemaakt om de bubbles op provincie te sorteren.

# 14 juni
Een hover functie aangebracht in de bubble chart waarin de namen van de scholen worden weergegeven als je er over heen gaat met je muis. Iedereen die de site teste wilde gelijk de cijfers van zijn school weten. Dit was tot nu toe nog niet mogelijk.

# 17 juni
Bij de bubblechart  het sorteren van de scholen de provincie namen toe te voegen bij de gesorteerde groepen. Zo is het makkelijker om je eigen school te vinden.
Ook word er een stroke meegegeven aan de geselecteerde bubble (bij de bubblechart).

# 18 juni
Zoekfunctie geïmplementeerd met behulp van jquery. Het zoeken bleef nogsteeds een beetje omslagtig voornamelijk als de bubbles erg klein waren kon het lastig zijn.

# 19 juni
De titel van de barchart past zich nu ook aan als er een school geselecteerd word. Op deze wijze is het duidelijker dat alle grafieken zich aanpassen op het geselecteerde element. Door kleine verschillen was dit soms onduidelijk.

# 20 juni
De schoolnamen hover functie van de bubblechart aangepast. Als je nu te veel naar beneden gescrold was kon je de namen niet meer lezen. Hiervoor is gekozen om een tooltip aan te maken met de schoolnamen en het aantal examenkandidaten.

# 21 juni
een aantal van de namen in de bubble chart waren slecht te lezen. Ter ondersteuning is er een legenda aangemaakt die zichtbaar is als je met je muis over de "i" gaat.
Bij het selecteren van een bubble van de bubblechart werd er tot nu toe een stroke megegeven. Dit was eigenlijk nog vrij onduidelijk. Er is gekozen om de bubble wit te maken en alle andere bubbles een opacity van 0.5 mee te geven. Hierdoor is gelijk duidelijk welke school geselecteerd is.

# 24 juni
Een groot deel van de code opgeschoont voornamelijk de init functie. Er staat nog veel dubbele code in. Ook de comments verduidelijkt. Ook is er een betere datastructuur aangebracht. Alle javascript, python, data, etz. bestanden zijn onderverdeeld in apparte mappen.
