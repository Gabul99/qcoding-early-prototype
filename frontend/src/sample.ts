export interface SampleData {
  rawTweet: string;
  code: string;
  theme: string;
}

export const sampleData: SampleData[] = [
  {
    rawTweet:
      "Joe Biden is an Imbecile. He doesn’t deserve to be President. We all know what happens if he wins. He will be found incompetent to serve. Kamala Harris will become President. Nancy Pelosi (if the dems retain the house) will be Vice President. And this country will go to hell.",
    code: "Personal insult — “Imbecile (바보)”",
    theme: "Criticizing others as incompetent (무능) to justify hate",
  },
  {
    rawTweet:
      "We like presidents that aren’t incompetent, don’t lie, don’t promote hate, are not corrupt and treasonous. #TrumpLiedAmericansDied #TrumpIsANationalDisgrace #BidenHarris2020  https://t.co/eBoXjohAUm",
    code: "Competence-based denigration — “incompetent (무능)”",
    theme: "Criticizing others as incompetent (무능) to justify hate",
  },
  {
    rawTweet:
      "@realDonaldTrump I BELIEVE IT'S TIME TO DRUG TEST JUNIOR YOU F**KING MORON!!!!!!!! #WAKEUPAMERICA THIS MORON IN THE W.H ISN'T EVEN QUALIFIED TO RUN AN LEMONADE STAND!!!! #TRUMPISALAUGHINGSTOCK #TRUMPFAILEDAMERICA #2OOKDEAD #BIDENHARRIS2020 #VOTEEARLY #VOTEEARLY #VOTEEARLY",
    code: "Insult with incompetence claim — “moron”",
    theme: "Criticizing others as incompetent (무능) to justify hate",
  },
  {
    rawTweet:
      "I wish death upon 45th President of the United States of America Donald J. Trump. He really deserves to die honestly. #trump2020 #covidhurryup #MAGA #CovidTrump  #COVIDMAGA",
    code: "Violent wish",
    theme: "Dehumanization through violence",
  },
  {
    rawTweet:
      "@donwinslow SO WE NEED TO GET RID OF THE FLOCK!!!!!!! TRUMP IS HANGING HIMSELF EVERYDAY!!!!!! HE'S NO WORRY WE JUST NEED TO ELIMINATE THE ENABLERS!!!!!! #THEGOPISTHEPROBLEM #THEGOPISTHEPROBLEM #WAKEUPAMERICA #WAKEUPAMERICA #BIDENHARRIS2020 #BIDENHARRIS2020 #GOEARLYVOTE #VOTEEARLY #VOTEEARLY",
    code: "Call for elimination",
    theme: "Dehumanization through violence",
  },
  {
    rawTweet:
      "@blueheartedly Kamala is gonna wipe the floor up with Pence!! #BidenHarris2020",
    code: "Violent metaphor — “wipe”",
    theme: "Dehumanization through violence",
  },
  {
    rawTweet:
      "Facebook approves of Nazi-ism but does not condone love.[NEWLINE][NEWLINE]Holy crap I’m angry about this![NEWLINE][NEWLINE]🤬F*ck Facebook🤬[NEWLINE][NEWLINE]#Biden2020 [NEWLINE]#ProudBoys https://t.co/S7pBKItrkD",
    code: "Emotional outburst profanity",
    theme: "Emotional justification",
  },
  {
    rawTweet:
      "@MoNiicole Big mad! You're a Christian but hate Joe Biden and Kamala Harris....right! Lol",
    code: "Emotional provocation",
    theme: "Emotional justification",
  },
  {
    rawTweet:
      "@Mike_Pence was talking soo much shit that there were literally flys over him 👽",
    code: "Emotional insult",
    theme: "Emotional justification",
  },
  {
    rawTweet:
      "Dog bites man and #LadyGraham is a hypocrite. #PackTheCourt #BidenHarris2020 #FDT  https://t.co/QO1sif2XaO",
    code: "Accuse hypocrisy",
    theme: "Moral high ground via hypocrisy (위선)",
  },
  {
    rawTweet:
      "The #DemocraticParty has no merit to say it’s hypocritical for @realDonaldTrump to want to nominate a #SCOTUS before the election considering their entire party is hypocrisy, @SpeakerPelosi being the most hypocritical one of all #WakeUpAmerica #Trump2020",
    code: "Community-wide hypocrisy claim",
    theme: "Moral high ground via hypocrisy (위선)",
  },
  {
    rawTweet:
      "@cidalia_borges @TheView @JoyVBehar @sunny The reality is you're a hypocrite if you voted for Joe, who's a racist and pedophile, and for Kamala Harris who is a COP who locked up black males for cheap labor. But go ahead and keep telling us how racist Trump is.",
    code: "Expose moral double‑standard",
    theme: "Moral high ground via hypocrisy (위선)",
  },
];
