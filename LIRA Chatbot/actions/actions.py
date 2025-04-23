import csv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from rasa_sdk.events import UserUtteranceReverted, ActiveLoop
from rasa_sdk.forms import FormValidationAction
from rasa_sdk.events import FollowupAction

class ActionSaveServiceRequestToCSV(Action):

    def name(self) -> Text:
        return "action_save_service_request_to_csv"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get the slot values
        service = tracker.get_slot('service')
        first_name = tracker.get_slot('first_name')
        last_name = tracker.get_slot('last_name')
        email = tracker.get_slot('email')
        affiliation = tracker.get_slot('affiliation')
        lab_partner = tracker.get_slot('lab_partner')
        facility = tracker.get_slot('facility')
        start_date = tracker.get_slot('start_date')
        end_date = tracker.get_slot('end_date')
        # Add any other slots you want to save

        # Define the CSV file path
        csv_file = 'service_requests.csv'

        # Create or append to the CSV file
        with open(csv_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            # Write the header row only if the file is empty
            if file.tell() == 0:
                writer.writerow(['Service', 'First Name', 'Last Name', 'Email', 'Affiliation', 'Lab Partner', 'Facility', 'Start Date', 'End Date'])
            
            # Write the slot values
            writer.writerow([service, first_name, last_name, email, affiliation, lab_partner, facility, start_date, end_date])

        # Send a message to the user confirming the request is saved
        dispatcher.utter_message(text="Your service request has been saved.")

<<<<<<< Updated upstream
        return []
=======
            # Commit transaction
            connection.commit()
            dispatcher.utter_message(text="Your service request has been saved successfully.")

        except Exception as e:
            dispatcher.utter_message(text=f"An error occurred while saving your request: {str(e)}")

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

        # Clear the slots after saving
        return [
            SlotSet("service", None),
            SlotSet("first_name", None),
            SlotSet("last_name", None),
            SlotSet("email", None),
            SlotSet("affiliation", None),
            SlotSet("lab_partner", None),
            SlotSet("facility", None),
            SlotSet("start_date", None),
            SlotSet("end_date", None),
        ]

class ValidateCommonNames(FormValidationAction):

    def name(self) -> Text:
        return "validate_common_names"

    def validate_first_name(
        self, slot_value: Any, dispatcher: CollectingDispatcher,
        tracker: Tracker, domain: Dict[Text, Any]
    ) -> Dict[Text, Any]:
        if isinstance(slot_value, str) and slot_value.strip().isalpha():
            return {"first_name": slot_value.strip().title()}
        dispatcher.utter_message(text="I didn't catch your first name clearly. Could you repeat it?")
        return {"first_name": None}

    def validate_last_name(
        self, slot_value: Any, dispatcher: CollectingDispatcher,
        tracker: Tracker, domain: Dict[Text, Any]
    ) -> Dict[Text, Any]:
        if isinstance(slot_value, str) and slot_value.strip().isalpha():
            return {"last_name": slot_value.strip().title()}
        dispatcher.utter_message(text="I didn't catch your last name clearly. Could you repeat it?")
        return {"last_name": None}

class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        active_loop = tracker.active_loop.get("name") if tracker.active_loop else None

        if active_loop:
            dispatcher.utter_message(text="I'm sorry, I didn't understand that. Can you rephrase?")
            return [
                ActiveLoop(name=active_loop),
                FollowupAction(name=active_loop)
            ]

        dispatcher.utter_message(text="I'm sorry, I didn't understand that. Can you rephrase?")
        return [UserUtteranceReverted()]
>>>>>>> Stashed changes
